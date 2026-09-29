// Walk With Me - Custom Hook: useRoute
// Manages destination search, geocoding, route preview calculation, and ETA
// Uses Search Box API with two-step suggest → retrieve flow

import { useState, useCallback, useRef, useEffect } from 'react';
import { searchDestinations, retrieveDestination, calculateRoute, type GeocodedDestination } from '../services/mapboxService';
import type { Coordinates, JourneyRoute } from '../types/journey';

export interface UseRouteReturn {
  searchResults: GeocodedDestination[];
  isSearching: boolean;
  selectedDestination: GeocodedDestination | null;
  route: JourneyRoute | null;
  isCalculatingRoute: boolean;
  searchError: string | null;
  routeError: string | null;
  search: (query: string, proximity?: Coordinates) => Promise<void>;
  selectDestination: (destination: GeocodedDestination, origin: Coordinates) => Promise<JourneyRoute | null>;
  clearRoute: () => void;
}

export const useRoute = (): UseRouteReturn => {
  const [searchResults, setSearchResults] = useState<GeocodedDestination[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<GeocodedDestination | null>(null);
  const [route, setRoute] = useState<JourneyRoute | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  // Track the latest search query to discard stale results
  const latestQueryRef = useRef<string>('');

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  const search = useCallback(async (query: string, proximity?: Coordinates) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setSearchError(null);
      latestQueryRef.current = '';
      return;
    }

    const currentQuery = query.trim();
    latestQueryRef.current = currentQuery;

    debounceTimerRef.current = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await searchDestinations(query, proximity);
        // Only apply results if this is still the latest query (prevents stale overwrite)
        if (latestQueryRef.current === currentQuery) {
          setSearchResults(results);
          if (results.length === 0) {
            setSearchError('No matching destinations found. Try a different search term.');
          }
        }
      } catch {
        if (latestQueryRef.current === currentQuery) {
          setSearchError('Unable to search destinations right now. Please try again.');
        }
      } finally {
        if (latestQueryRef.current === currentQuery) {
          setIsSearching(false);
        }
      }
    }, 300);
  }, []);

  const selectDestination = useCallback(
    async (destination: GeocodedDestination, origin: Coordinates): Promise<JourneyRoute | null> => {
      setIsCalculatingRoute(true);
      setRouteError(null);

      try {
        let resolvedDest = destination;

        // If we used Search Box API and the coordinates are missing (0,0),
        // we need to call /retrieve to get the actual coordinates
        if (
          destination.mapbox_id &&
          (!destination.coordinates.latitude || !destination.coordinates.longitude)
        ) {
          const retrieved = await retrieveDestination(destination.mapbox_id, origin);
          if (retrieved && retrieved.coordinates.latitude && retrieved.coordinates.longitude) {
            resolvedDest = retrieved;
          } else {
            throw new Error('Could not resolve destination coordinates. Please try a different search.');
          }
        }

        setSelectedDestination(resolvedDest);

        const calculated = await calculateRoute(origin, resolvedDest.coordinates, 'walking');
        setRoute(calculated);
        return calculated;
      } catch (err: any) {
        setRouteError(err.message || 'Failed to calculate route to destination.');
        return null;
      } finally {
        setIsCalculatingRoute(false);
      }
    },
    []
  );

  const clearRoute = useCallback(() => {
    setSelectedDestination(null);
    setRoute(null);
    setSearchResults([]);
    setSearchError(null);
    setRouteError(null);
    latestQueryRef.current = '';
  }, []);

  return {
    searchResults,
    isSearching,
    selectedDestination,
    route,
    isCalculatingRoute,
    searchError,
    routeError,
    search,
    selectDestination,
    clearRoute,
  };
};
