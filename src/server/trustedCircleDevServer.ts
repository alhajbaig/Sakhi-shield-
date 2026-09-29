// SakhiShield — Trusted Circle Real Shared Backend Middleware for Vite
// Ensures seamless multi-user, multi-browser, incognito, and cross-device sync
// even before/without manual cloud database migrations.

import type { Plugin, ViteDevServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

interface StoredData {
  circles: any[];
  members: any[];
  alerts: any[];
  recipients: any[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'trusted_circles_store.json');

function ensureDataFile(): StoredData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial: StoredData = {
      circles: [],
      members: [],
      alerts: [],
      recipients: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { circles: [], members: [], alerts: [], recipients: [] };
  }
}

function saveData(data: StoredData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[trustedCircleDevServer] Error saving data:', err);
  }
}

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

function normalizeCode(raw?: string): string {
  const clean = (raw || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (!clean) return '';
  if (!clean.startsWith('SC-')) {
    if (clean.startsWith('SC')) {
      return 'SC-' + clean.slice(2);
    }
    return 'SC-' + clean;
  }
  return clean;
}

export function trustedCircleDevServerPlugin(): Plugin {
  return {
    name: 'trusted-circle-dev-server',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/trusted-circle')) {
          return next();
        }

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.end();
          return;
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;
        const data = ensureDataFile();

        try {
          // 1. Lookup circle by invite code: GET /api/trusted-circle/lookup?code=SC-XXXXXX
          if (pathname === '/api/trusted-circle/lookup' && req.method === 'GET') {
            const raw = url.searchParams.get('code') || '';
            const normalized = normalizeCode(raw);
            if (!normalized) {
              return sendJson(res, 400, { error: 'Code parameter is required' });
            }
            const circle = data.circles.find(
              (c) => (normalizeCode(c.invite_code) === normalized || c.invite_code?.toUpperCase() === raw.trim().toUpperCase()) && c.status === 'ACTIVE'
            );
            if (!circle) {
              return sendJson(res, 404, { error: "That invitation code isn't valid." });
            }
            return sendJson(res, 200, { circle });
          }

          // 2. Create circle: POST /api/trusted-circle/create
          if (pathname === '/api/trusted-circle/create' && req.method === 'POST') {
            const body = await parseBody(req);
            const { circle, member } = body;
            if (!circle || !circle.invite_code) {
              return sendJson(res, 400, { error: 'Invalid circle payload' });
            }

            // Upsert circle
            const existingIdx = data.circles.findIndex((c) => c.id === circle.id);
            if (existingIdx >= 0) {
              data.circles[existingIdx] = circle;
            } else {
              data.circles.push(circle);
            }

            // Upsert owner member
            if (member) {
              const memIdx = data.members.findIndex((m) => m.id === member.id);
              if (memIdx >= 0) {
                data.members[memIdx] = member;
              } else {
                data.members.push(member);
              }
            }

            saveData(data);
            return sendJson(res, 200, { success: true, circle });
          }

          // 3. Get user circles: GET /api/trusted-circle/user-circles?userId=...
          if (pathname === '/api/trusted-circle/user-circles' && req.method === 'GET') {
            const userId = url.searchParams.get('userId');
            if (!userId) {
              return sendJson(res, 400, { error: 'userId is required' });
            }

            const userMemberships = data.members.filter(
              (m) => m.user_id === userId && (m.status === 'APPROVED' || m.status === 'PENDING')
            );
            const circleIds = new Set(userMemberships.map((m) => m.circle_id));
            const userCircles = data.circles.filter(
              (c) => (circleIds.has(c.id) || c.owner_id === userId) && c.status === 'ACTIVE'
            );

            // Enrich member count
            const enriched = userCircles.map((c) => ({
              ...c,
              member_count: data.members.filter(
                (m) => m.circle_id === c.id && m.status === 'APPROVED'
              ).length,
            }));

            return sendJson(res, 200, { circles: enriched });
          }

          // 4. Get circle members: GET /api/trusted-circle/members?circleId=...
          if (pathname === '/api/trusted-circle/members' && req.method === 'GET') {
            const circleId = url.searchParams.get('circleId');
            if (!circleId) {
              return sendJson(res, 400, { error: 'circleId is required' });
            }
            const members = data.members.filter((m) => m.circle_id === circleId);
            return sendJson(res, 200, { members });
          }

          // 5. Join circle: POST /api/trusted-circle/join
          if (pathname === '/api/trusted-circle/join' && req.method === 'POST') {
            const body = await parseBody(req);
            const { code, userId, userName, userPhone, userEmail } = body;
            const normalized = normalizeCode(code);

            const circle = data.circles.find(
              (c) => (normalizeCode(c.invite_code) === normalized || c.invite_code?.toUpperCase() === code?.trim().toUpperCase()) && c.status === 'ACTIVE'
            );
            if (!circle) {
              return sendJson(res, 404, { error: "That invitation code isn't valid." });
            }

            // Check if already a member
            const existing = data.members.find(
              (m) => m.circle_id === circle.id && m.user_id === userId
            );
            if (existing) {
              if (existing.status === 'APPROVED') {
                return sendJson(res, 200, {
                  success: true,
                  circle,
                  member: existing,
                  isPending: false,
                  alreadyMember: true,
                });
              } else {
                // Entering the valid code auto-approves pending request!
                existing.status = 'APPROVED';
                existing.updated_at = new Date().toISOString();
                saveData(data);
                return sendJson(res, 200, {
                  success: true,
                  circle,
                  member: existing,
                  isPending: false,
                });
              }
            }

            const now = new Date().toISOString();
            const newMember = {
              id: `mem_${randomUUID().replace(/-/g, '').slice(0, 10)}`,
              circle_id: circle.id,
              user_id: userId,
              role: 'MEMBER',
              status: 'APPROVED',
              joined_at: now,
              updated_at: now,
              user_name: userName || 'Member',
              user_phone: userPhone,
              user_email: userEmail,
              is_online: true,
            };

            data.members.push(newMember);
            saveData(data);
            return sendJson(res, 200, {
              success: true,
              circle,
              member: newMember,
              isPending: false,
            });
          }

          // 6. Approve member: POST /api/trusted-circle/approve
          if (pathname === '/api/trusted-circle/approve' && req.method === 'POST') {
            const { memberId } = await parseBody(req);
            const mem = data.members.find((m) => m.id === memberId);
            if (mem) {
              mem.status = 'APPROVED';
              mem.updated_at = new Date().toISOString();
              saveData(data);
            }
            return sendJson(res, 200, { success: true });
          }

          // 7. Decline / remove member: POST /api/trusted-circle/remove
          if (pathname === '/api/trusted-circle/remove' && req.method === 'POST') {
            const { memberId } = await parseBody(req);
            data.members = data.members.filter((m) => m.id !== memberId);
            saveData(data);
            return sendJson(res, 200, { success: true });
          }

          // 7b. Leave circle: POST /api/trusted-circle/leave
          if (pathname === '/api/trusted-circle/leave' && req.method === 'POST') {
            const { circleId, userId } = await parseBody(req);
            data.members = data.members.filter(
              (m) => !(m.circle_id === circleId && m.user_id === userId)
            );
            saveData(data);
            return sendJson(res, 200, { success: true });
          }

          // 7c. Delete circle: POST /api/trusted-circle/delete
          if (pathname === '/api/trusted-circle/delete' && req.method === 'POST') {
            const { circleId } = await parseBody(req);
            data.circles = data.circles.filter((c) => c.id !== circleId);
            data.members = data.members.filter((m) => m.circle_id !== circleId);
            data.alerts = data.alerts.filter((a) => a.circle_id !== circleId);
            saveData(data);
            return sendJson(res, 200, { success: true });
          }

          // 8. Regenerate code: POST /api/trusted-circle/regenerate
          if (pathname === '/api/trusted-circle/regenerate' && req.method === 'POST') {
            const { circleId, newCode } = await parseBody(req);
            const circle = data.circles.find((c) => c.id === circleId);
            if (circle) {
              circle.invite_code = newCode;
              circle.updated_at = new Date().toISOString();
              saveData(data);
            }
            return sendJson(res, 200, { success: true, newCode });
          }

          // 9. Alert dispatch: POST /api/trusted-circle/alert
          if (pathname === '/api/trusted-circle/alert' && req.method === 'POST') {
            const { alert, recipients } = await parseBody(req);
            const now = new Date().toISOString();
            if (alert) {
              // ── Single Active Emergency Session Rule ──
              // In production safety systems, a user has at most ONE active alert at a time.
              // Mark any prior unresolved alerts by this user as RESOLVED to prevent alert stacking / zombies.
              for (const a of data.alerts) {
                if (
                  a.triggered_by_user_id === alert.triggered_by_user_id &&
                  a.id !== alert.id &&
                  a.status !== 'RESOLVED'
                ) {
                  a.status = 'RESOLVED';
                  a.resolved_at = now;
                  a.updated_at = now;
                }
              }

              const existingIdx = data.alerts.findIndex((a) => a.id === alert.id);
              if (existingIdx >= 0) {
                data.alerts[existingIdx] = { ...data.alerts[existingIdx], ...alert, updated_at: now };
              } else {
                data.alerts.push(alert);
              }

              // Auto-populate all circle members as alert recipients (strictly deduplicated)
              if (alert.circle_id) {
                const circleMembers = data.members.filter(
                  (m) => m.circle_id === alert.circle_id && m.user_id !== alert.triggered_by_user_id && m.status === 'APPROVED'
                );
                for (const cm of circleMembers) {
                  const already = data.recipients.some(
                    (r) => r.alert_id === alert.id && r.user_id === cm.user_id
                  );
                  if (!already) {
                    data.recipients.push({
                      id: `rcp_${randomUUID().replace(/-/g, '').slice(0, 10)}`,
                      alert_id: alert.id,
                      user_id: cm.user_id,
                      user_name: cm.user_name || 'Guardian',
                      user_phone: cm.user_phone,
                      status: 'SENT',
                      sent_at: now,
                    });
                  }
                }
              }
            }

            // Merge any incoming recipient items with deduplication by user_id
            if (Array.isArray(recipients) && alert) {
              for (const r of recipients) {
                const existingIdx = data.recipients.findIndex(
                  (x) => x.id === r.id || (x.alert_id === alert.id && x.user_id === r.user_id)
                );
                if (existingIdx >= 0) {
                  data.recipients[existingIdx] = { ...data.recipients[existingIdx], ...r };
                } else {
                  data.recipients.push(r);
                }
              }
            }
            saveData(data);
            return sendJson(res, 200, { success: true });
          }

          // 10. Get active alerts for user: GET /api/trusted-circle/active-alerts?userId=...
          if (pathname === '/api/trusted-circle/active-alerts' && req.method === 'GET') {
            const userId = url.searchParams.get('userId');
            if (!userId) {
              return sendJson(res, 400, { error: 'userId is required' });
            }

            // Auto-resolve any ancient alerts (> 24h) to keep system clean and leak-free
            const nowMs = Date.now();
            let autoCleaned = false;
            for (const a of data.alerts) {
              if (a.status !== 'RESOLVED' && a.created_at) {
                const ageMs = nowMs - new Date(a.created_at).getTime();
                if (ageMs > 24 * 60 * 60 * 1000) {
                  a.status = 'RESOLVED';
                  a.resolved_at = new Date().toISOString();
                  a.updated_at = new Date().toISOString();
                  autoCleaned = true;
                }
              }
            }
            if (autoCleaned) {
              saveData(data);
            }

            // Find all circles where this user is an approved member or owner
            const userCircles = new Set(
              data.members
                .filter((m) => m.user_id === userId && (m.status === 'APPROVED' || m.role === 'OWNER'))
                .map((m) => m.circle_id)
            );
            data.circles.filter((c) => c.owner_id === userId).forEach((c) => userCircles.add(c.id));

            const outgoing = data.alerts
              .filter((a) => a.triggered_by_user_id === userId && a.status !== 'RESOLVED')
              .map((a) => ({
                ...a,
                recipients: data.recipients.filter((r) => r.alert_id === a.id),
              }));

            // Incoming: alerts in the user's circle triggered by others, where this user hasn't acknowledged
            const incoming = data.alerts
              .filter((a) => {
                if (a.triggered_by_user_id === userId || a.status === 'RESOLVED') return false;
                const isInCircle = userCircles.has(a.circle_id);
                const isExplicitRecipient = data.recipients.some((r) => r.alert_id === a.id && r.user_id === userId);
                if (!isInCircle && !isExplicitRecipient) return false;

                // If user has acknowledged ANY recipient record for this alert, do NOT show
                const hasAcked = data.recipients.some(
                  (r) => r.alert_id === a.id && r.user_id === userId && r.status === 'ACKNOWLEDGED'
                );
                if (hasAcked) return false;

                return true;
              })
              .map((a) => ({
                ...a,
                recipients: data.recipients.filter((r) => r.alert_id === a.id),
              }));

            return sendJson(res, 200, { incomingAlerts: incoming, outgoingAlerts: outgoing });
          }

          // 11. Acknowledge alert: POST /api/trusted-circle/acknowledge
          if (pathname === '/api/trusted-circle/acknowledge' && req.method === 'POST') {
            const { alertId, userId } = await parseBody(req);
            const now = new Date().toISOString();
            let ackCount = 0;

            // Update ALL recipient records for this user and alert (handles historical duplicate records)
            for (const r of data.recipients) {
              if (r.alert_id === alertId && r.user_id === userId) {
                r.status = 'ACKNOWLEDGED';
                r.acknowledged_at = now;
                ackCount++;
              }
            }

            // Update alert status
            const alert = data.alerts.find((a) => a.id === alertId);
            if (alert && alert.status !== 'RESOLVED') {
              alert.status = 'ACKNOWLEDGED';
              alert.acknowledged_at = alert.acknowledged_at || now;
              alert.updated_at = now;
            }

            saveData(data);
            return sendJson(res, 200, { success: true, ackCount });
          }

          // 12. Resolve alert ('I AM SAFE'): POST /api/trusted-circle/resolve
          // Must resolve by alertId AND/OR by userId/circleId to guarantee NO zombie alerts remain
          if (pathname === '/api/trusted-circle/resolve' && req.method === 'POST') {
            const { alertId, userId, circleId } = await parseBody(req);
            const now = new Date().toISOString();
            let resolvedCount = 0;

            for (const a of data.alerts) {
              const matchesAlertId = alertId && a.id === alertId;
              const matchesUserId = userId && a.triggered_by_user_id === userId;
              const matchesCircleId = circleId && !alertId && !userId && a.circle_id === circleId;

              if ((matchesAlertId || matchesUserId || matchesCircleId) && a.status !== 'RESOLVED') {
                a.status = 'RESOLVED';
                a.resolved_at = now;
                a.updated_at = now;
                resolvedCount++;
              }
            }

            saveData(data);
            return sendJson(res, 200, { success: true, resolvedCount });
          }

          return next();
        } catch (err: any) {
          console.error('[trustedCircleDevServer] Request handling error:', err);
          return sendJson(res, 500, { error: err?.message || 'Server error' });
        }
      });
    },
  };
}
