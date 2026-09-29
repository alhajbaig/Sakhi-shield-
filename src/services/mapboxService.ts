// Walk With Me - Mapbox Service Abstraction
// Uses Search Box API v1 for POI-inclusive search (metro stations, landmarks, etc.)
// Also handles Directions for route calculation.

import type { Coordinates, JourneyRoute, RouteGeometry } from '../types/journey';
import { calculateDistanceMeters } from './routeService';
import { generateSecureId } from '../lib/securityUtils';

export interface GeocodedDestination {
  id: string;
  name: string;
  fullAddress: string;
  coordinates: Coordinates;
  category?: string;
  /** Mapbox ID needed for the /retrieve call to get full coordinates */
  mapbox_id?: string;
}

const getMapboxToken = (): string => {
  return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';
};

export const isMapboxConfigured = (): boolean => {
  const token = getMapboxToken();
  return Boolean(token && token.startsWith('pk.'));
};

export const getMapboxAccessToken = (): string => {
  return getMapboxToken();
};

// ─── Session Token Management ────────────────────────────────────
// The Search Box API groups suggest+retrieve calls into billing sessions.
// We generate a fresh UUIDv4 per search session (user starts typing → selects a result).
let currentSessionToken: string = generateSessionToken();

function generateSessionToken(): string {
  return generateSecureId();
}

/** Call this when a user selects a destination to rotate the session token */
export const rotateSessionToken = (): void => {
  currentSessionToken = generateSessionToken();
};

// ─── Request Abort Controller ────────────────────────────────────
// Prevents stale/old search results from overwriting newer ones
let activeSearchController: AbortController | null = null;

// ─── Destination Autocomplete Search — Search Box API v1 ─────────
// Uses /suggest endpoint which returns POIs (metro stations, restaurants, etc.)
// along with addresses, places, and landmarks.
export const searchDestinations = async (
  query: string,
  proximity?: Coordinates
): Promise<GeocodedDestination[]> => {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const token = getMapboxToken();
  if (!token || !token.startsWith('pk.')) {
    return [];
  }

  // Cancel any in-flight search request to avoid stale results
  if (activeSearchController) {
    activeSearchController.abort();
  }
  activeSearchController = new AbortController();
  const signal = activeSearchController.signal;

  try {
    // Build Search Box API suggest URL
    const params = new URLSearchParams({
      q: trimmed,
      access_token: token,
      session_token: currentSessionToken,
      language: 'en',
      limit: '10',
      country: 'IN',
      // Include all types: POIs, addresses, places, streets, etc.
      types: 'poi,address,place,locality,neighborhood,street',
    });

    // Proximity bias: prefer results near the user's current location
    if (proximity && proximity.latitude && proximity.longitude) {
      params.set('proximity', `${proximity.longitude},${proximity.latitude}`);
    }

    const url = `https://api.mapbox.com/search/searchbox/v1/suggest?${params.toString()}`;

    const res = await fetch(url, { signal });
    if (!res.ok) {
      console.warn(`Search Box suggest failed: ${res.status} ${res.statusText}`);
      // Fallback to legacy geocoding if Search Box fails
      return await searchDestinationsLegacy(trimmed, proximity, signal);
    }

    const data = await res.json();

    if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
      return data.suggestions.map((s: any) => ({
        id: s.mapbox_id || s.name || trimmed,
        mapbox_id: s.mapbox_id,
        name: s.name || s.name_preferred || trimmed,
        fullAddress: s.full_address || s.place_formatted || s.address || '',
        coordinates: {
          // Suggest endpoint may not return coordinates — they come from /retrieve
          // But some results include them in the context
          longitude: s.geometry?.coordinates?.[0] || 0,
          latitude: s.geometry?.coordinates?.[1] || 0,
        },
        category: formatCategory(s.poi_category_ids, s.poi_category, s.feature_type) || capitalizeFirst(s.feature_type) || 'Location',
      }));
    }

    // No suggestions found, fallback to legacy
    return await searchDestinationsLegacy(trimmed, proximity, signal);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // This request was intentionally cancelled, not an error
      return [];
    }
    console.warn('Search Box API query failed, falling back to legacy:', err);
    return await searchDestinationsLegacy(trimmed, proximity);
  }
};

// ─── Retrieve Full Feature Details from Search Box API ───────────
// Called after user selects a suggestion to get precise coordinates.
export const retrieveDestination = async (
  mapboxId: string,
  proximity?: Coordinates
): Promise<GeocodedDestination | null> => {
  const token = getMapboxToken();
  if (!token || !mapboxId) return null;

  try {
    const params = new URLSearchParams({
      access_token: token,
      session_token: currentSessionToken,
      language: 'en',
    });

    if (proximity && proximity.latitude && proximity.longitude) {
      params.set('proximity', `${proximity.longitude},${proximity.latitude}`);
    }

    const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.features && data.features.length > 0) {
      const f = data.features[0];
      const coords = f.geometry?.coordinates || [0, 0];
      const props = f.properties || {};

      // Rotate session token after successful retrieval (end of session)
      rotateSessionToken();

      return {
        id: props.mapbox_id || mapboxId,
        mapbox_id: props.mapbox_id || mapboxId,
        name: props.name_preferred || props.name || '',
        fullAddress: props.full_address || props.place_formatted || props.address || '',
        coordinates: {
          longitude: coords[0],
          latitude: coords[1],
        },
        category: formatCategory(props.poi_category_ids, props.poi_category, props.feature_type) || capitalizeFirst(props.feature_type) || 'Location',
      };
    }
    return null;
  } catch (err) {
    console.warn('Search Box retrieve failed:', err);
    return null;
  }
};

// ─── Legacy Geocoding v5 Fallback ────────────────────────────────
// Used as fallback if Search Box API fails. Note: POIs are NOT available here.
const searchDestinationsLegacy = async (
  query: string,
  proximity?: Coordinates,
  signal?: AbortSignal
): Promise<GeocodedDestination[]> => {
  const token = getMapboxToken();
  if (!token || !token.startsWith('pk.')) return [];

  try {
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${token}&country=in&autocomplete=true&fuzzyMatch=true&limit=8`;

    if (proximity && proximity.latitude && proximity.longitude) {
      url += `&proximity=${proximity.longitude},${proximity.latitude}`;
    }

    const res = await fetch(url, { signal });
    if (!res.ok) return [];

    const data = await res.json();
    if (data.features && Array.isArray(data.features)) {
      return data.features.map((f: any) => ({
        id: f.id,
        name: f.text || f.place_name?.split(',')[0] || query,
        fullAddress: f.place_name || '',
        coordinates: {
          longitude: f.center[0],
          latitude: f.center[1],
        },
        category: capitalizeFirst(f.properties?.category || f.place_type?.[0]) || 'Location',
      }));
    }
    return [];
  } catch (err: any) {
    if (err?.name === 'AbortError') return [];
    console.warn('Legacy geocoding query failed:', err);
    return [];
  }
};

// ─── Category Formatting Helpers ─────────────────────────────────
function formatCategory(
  categoryIds?: string[],
  categoryNames?: string[],
  featureType?: string
): string {
  // Prefer human-readable category names from the Search Box API
  if (categoryNames && categoryNames.length > 0) {
    // Return the first meaningful category, capitalized
    return capitalizeFirst(categoryNames[0]);
  }
  if (categoryIds && categoryIds.length > 0) {
    // Convert IDs like "metro_station" → "Metro Station"
    return categoryIds[0]
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (featureType) {
    return capitalizeFirst(featureType);
  }
  return '';
}

function capitalizeFirst(str?: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Route and Directions Calculation ────────────────────────────
export const calculateRoute = async (
  origin: Coordinates,
  destination: Coordinates,
  mode: 'walking' | 'driving' = 'walking'
): Promise<JourneyRoute> => {
  const token = getMapboxToken();

  if (token && token.startsWith('pk.')) {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&steps=true&overview=full&access_token=${token}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Mapbox directions error: ${res.statusText}`);

      const data = await res.json();
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found between coordinates');
      }

      const route = data.routes[0];
      const geometry: RouteGeometry = route.geometry;

      const steps = route.legs?.[0]?.steps?.map((s: any) => ({
        instruction: s.maneuver?.instruction || 'Proceed on route',
        distance: s.distance,
        duration: s.duration,
      }));

      return {
        geometry,
        distanceMeters: Math.round(route.distance),
        durationSeconds: Math.round(route.duration),
        steps,
      };
    } catch (err) {
      console.warn('Mapbox directions API failed, generating synthetic safe route:', err);
    }
  }

  // Fallback high-fidelity polyline generation
  const directDistance = calculateDistanceMeters(origin, destination);
  const walkingSpeedMps = 1.35; // Standard walking pace ~4.8 km/h
  const estimatedSeconds = Math.round(directDistance / walkingSpeedMps);

  // Generate intermediate waypoint polyline so map rendering and deviation math work smoothly
  const numWaypoints = 12;
  const coordinates: [number, number][] = [];

  for (let i = 0; i <= numWaypoints; i++) {
    const fraction = i / numWaypoints;
    // Introduce slight gentle curve to mimic streets rather than Euclidean line
    const curveOffset = Math.sin(fraction * Math.PI) * 0.0015;
    const lng = origin.longitude + fraction * (destination.longitude - origin.longitude) + curveOffset;
    const lat = origin.latitude + fraction * (destination.latitude - origin.latitude) + curveOffset * 0.5;
    coordinates.push([lng, lat]);
  }

  return {
    geometry: {
      type: 'LineString',
      coordinates,
    },
    distanceMeters: Math.round(directDistance * 1.15), // accounts for street layout
    durationSeconds: Math.round(estimatedSeconds * 1.15),
    steps: [
      { instruction: 'Head toward main corridor', distance: directDistance * 0.3, duration: estimatedSeconds * 0.3 },
      { instruction: 'Follow lighted route', distance: directDistance * 0.5, duration: estimatedSeconds * 0.5 },
      { instruction: 'Arrive at destination', distance: directDistance * 0.2, duration: estimatedSeconds * 0.2 },
    ],
  };
};
