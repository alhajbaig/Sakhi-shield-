// SakhiShield — Automated Test Suite for Help & Safety Resources Module

import assert from 'node:assert';
import { resourceService } from '../features/help-safety-resources/services/resourceService';

console.log('🧪 Starting Help & Safety Resources Automated Test Suite...\n');

// ── Test 1: Verified Helplines Retrieval & Official Status ──
console.log('Test 1: Verified Directory Retrieval & Data Integrity');
const resources = await resourceService.getResources();
assert(Array.isArray(resources), 'Resources must be an array');
assert(resources.length >= 9, 'Must have at least 9 verified official resources');

const erss112 = resources.find((r) => r.phone === '112');
assert.ok(erss112, '112 ERSS emergency helpline must exist');
assert.strictEqual(erss112.isOfficial, true);
assert.strictEqual(erss112.category, 'EMERGENCY');

const women1091 = resources.find((r) => r.phone === '1091');
assert.ok(women1091, '1091 Women emergency helpline must exist');
assert.strictEqual(women1091.category, 'WOMENS_SAFETY');

const cyber1930 = resources.find((r) => r.phone === '1930');
assert.ok(cyber1930, '1930 Cyber crime helpline must exist');
assert.strictEqual(cyber1930.category, 'CYBER_DIGITAL');
console.log('✅ Test 1 Passed: Authentic official emergency helplines verified.\n');

// ── Test 2: In-Memory Search & Category Filtering ──
console.log('Test 2: Search & Category Filtering');
// Filter by category
const emergencyOnly = resourceService.searchResources(resources, 'EMERGENCY', '');
assert(emergencyOnly.length > 0);
assert(emergencyOnly.every((r) => r.category === 'EMERGENCY'));

// Filter by keyword 'cyber'
const cyberSearch = resourceService.searchResources(resources, 'ALL', 'cyber');
assert(cyberSearch.length > 0);
assert(cyberSearch.some((r) => r.phone === '1930'));

// Filter by keyword '112'
const phoneSearch = resourceService.searchResources(resources, 'ALL', '112');
assert.strictEqual(phoneSearch.length, 1);
assert.strictEqual(phoneSearch[0].phone, '112');
console.log('✅ Test 2 Passed: In-memory search and category filtering verified.\n');

// ── Test 3: Safety Guides Structure & Feature Cross-Links ──
console.log('Test 3: Interactive Safety Guides');
const guides = resourceService.getSafetyGuides();
assert(Array.isArray(guides), 'Guides must be an array');
assert(guides.length >= 5, 'Must have at least 5 structured safety guides');

const emergencyGuide = guides.find((g) => g.id === 'guide_emergency_protocol');
assert.ok(emergencyGuide, 'Emergency protocol guide must exist');
assert(emergencyGuide.steps.length >= 4, 'Must have multi-step procedure');
assert.ok(emergencyGuide.relatedFeatureUrl, 'Guide must cross-link to SakhiShield feature');
console.log('✅ Test 3 Passed: Safety guides and feature cross-links verified.\n');

// ── Test 4: Frequently Asked Questions ──
console.log('Test 4: Architectural FAQs');
const faqs = resourceService.getFAQs();
assert(Array.isArray(faqs), 'FAQs must be an array');
assert(faqs.length >= 6, 'Must have at least 6 detailed FAQ entries');

const locationFaq = faqs.find((f) => f.id === 'faq_location_storage');
assert.ok(locationFaq, 'Location storage FAQ must exist');
assert(locationFaq.answer.toLowerCase().includes('ephemeral gps windows'), 'Answer must accurately describe ephemeral windows');
console.log('✅ Test 4 Passed: Architectural FAQs verified.\n');

console.log('🎉 ALL HELP & SAFETY RESOURCES TESTS PASSED SUCCESSFULLY!\n');
