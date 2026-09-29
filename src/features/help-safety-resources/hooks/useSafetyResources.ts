// SakhiShield — useSafetyResources Hook

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { SafetyResource, ResourceCategory, SafetyGuide, FAQItem } from '../types/resources.types';
import { resourceService } from '../services/resourceService';

export function useSafetyResources() {
  const [resources, setResources] = useState<SafetyResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await resourceService.getResources();
      setResources(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const filteredResources = useMemo(() => {
    return resourceService.searchResources(resources, selectedCategory, searchQuery);
  }, [resources, selectedCategory, searchQuery]);

  const guides: SafetyGuide[] = useMemo(() => {
    return resourceService.getSafetyGuides();
  }, []);

  const faqs: FAQItem[] = useMemo(() => {
    return resourceService.getFAQs();
  }, []);

  return {
    resources,
    filteredResources,
    guides,
    faqs,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    refreshResources: loadResources,
  };
}
