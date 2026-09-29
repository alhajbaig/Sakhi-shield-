// SakhiShield — Help & Safety Resources Service
// Manages verified safety directories, offline caching, search, guides, and FAQs.

import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import type { SafetyResource, ResourceCategory, SafetyGuide, FAQItem } from '../types/resources.types';
import { VERIFIED_SAFETY_RESOURCES } from '../data/verifiedHelplines';
import { SAFETY_GUIDES } from '../data/safetyGuidesData';
import { FAQ_DATA } from '../data/faqData';
import { RESOURCE_STORAGE_KEYS } from '../constants/resources.constants';

const memoryStore = new Map<string, string>();
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem(key);
        if (val !== undefined && val !== null) return val;
      }
    } catch {}
    return memoryStore.get(key) || null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch {}
    memoryStore.set(key, val);
  },
};

export class ResourceService {
  /**
   * Retrieves verified safety resources with Supabase remote sync and local fallback
   */
  async getResources(): Promise<SafetyResource[]> {
    // 1. Try fetching live updates from Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('safety_resources')
          .select('*')
          .order('priority', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: SafetyResource[] = data.map((r: any) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            description: r.description,
            phone: r.phone,
            whatsapp: r.whatsapp,
            website: r.website,
            availability: r.availability,
            country: r.country,
            source: r.source,
            verifiedAt: r.verified_at,
            isOfficial: r.is_official,
            priority: r.priority,
          }));
          this.saveCache(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('[ResourceService] Supabase directory error, using local fallback:', err);
      }
    }

    // 2. Check local cached copy
    const cached = this.getCache();
    if (cached && cached.length > 0) {
      return cached;
    }

    // 3. Fall back to bundled verified dataset
    this.saveCache(VERIFIED_SAFETY_RESOURCES);
    return VERIFIED_SAFETY_RESOURCES;
  }

  /**
   * Filters and searches resources in-memory
   */
  searchResources(
    resources: SafetyResource[],
    category: ResourceCategory,
    query: string
  ): SafetyResource[] {
    let filtered = resources;

    if (category !== 'ALL') {
      filtered = filtered.filter((r) => r.category === category);
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.phone && r.phone.includes(q)) ||
          r.category.toLowerCase().includes(q) ||
          r.source.toLowerCase().includes(q)
      );
    }

    return filtered;
  }

  /**
   * Returns bundled verified safety guides
   */
  getSafetyGuides(): SafetyGuide[] {
    return SAFETY_GUIDES;
  }

  /**
   * Returns bundled verified FAQ dataset
   */
  getFAQs(): FAQItem[] {
    return FAQ_DATA;
  }

  private getCache(): SafetyResource[] | null {
    try {
      const data = safeStorage.getItem(RESOURCE_STORAGE_KEYS.CACHED_RESOURCES);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveCache(resources: SafetyResource[]): void {
    try {
      safeStorage.setItem(RESOURCE_STORAGE_KEYS.CACHED_RESOURCES, JSON.stringify(resources));
    } catch {}
  }
}

export const resourceService = new ResourceService();
