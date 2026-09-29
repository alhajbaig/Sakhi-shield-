// Walk With Me - Real Mapbox GL & Vector Map Component
// Renders live map with route line, START/END markers with labels, accuracy radius, and fallback vector engine
// On journey start: zooms out to fit entire route with both markers visible

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapboxAccessToken, isMapboxConfigured } from '../../services/mapboxService';
import type { Coordinates, GPSPoint, RouteGeometry } from '../../types/journey';
import { Navigation, Plus, Minus, Maximize2, Compass } from 'lucide-react';

interface WalkWithMeMapProps {
  userLocation: GPSPoint | null;
  destinationLocation?: Coordinates | null;
  destinationName?: string;
  routeGeometry?: RouteGeometry | null;
  deviationDistance?: number;
  isMonitoring?: boolean;
  /** When true, the map will zoom out to fit the entire route on first render */
  fitRouteOnStart?: boolean;
  className?: string;
  onRecenter?: () => void;
}

export const WalkWithMeMap: React.FC<WalkWithMeMapProps> = ({
  userLocation,
  destinationLocation,
  destinationName,
  routeGeometry,
  deviationDistance = 0,
  isMonitoring = false,
  fitRouteOnStart = false,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const startMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const hasCenteredOnUserRef = useRef(false);
  const hasInitialFitRef = useRef(false);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  const hasMapbox = isMapboxConfigured();

  // ─── Create styled marker element ────────────────────────────
  const createStartMarkerEl = () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; z-index:10;';
    wrapper.innerHTML = `
      <div style="background:#059669; width:36px; height:36px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(5,150,105,0.5); position:relative;">
        <div style="width:12px; height:12px; border-radius:50%; background:white;"></div>
      </div>
      <div style="margin-top:5px; background:#059669; color:white; padding:3px 10px; border-radius:8px; font-size:11px; font-weight:800; font-family:ui-monospace,monospace; letter-spacing:0.08em; white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.2);">
        YOU
      </div>
    `;
    return wrapper;
  };

  const createDestMarkerEl = (name?: string) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; z-index:10;';
    const label = name ? (name.length > 22 ? name.substring(0, 20) + '…' : name) : 'Destination';
    wrapper.innerHTML = `
      <div style="background:#F62440; width:36px; height:36px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(246,36,64,0.5);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      </div>
      <div style="margin-top:5px; background:#F62440; color:white; padding:3px 10px; border-radius:8px; font-size:11px; font-weight:800; font-family:ui-monospace,monospace; letter-spacing:0.05em; white-space:nowrap; max-width:200px; overflow:hidden; text-overflow:ellipsis; box-shadow:0 2px 8px rgba(0,0,0,0.2);">
        ${label}
      </div>
    `;
    return wrapper;
  };

  const createUserDotEl = () => {
    const el = document.createElement('div');
    el.style.cssText = 'z-index:15;';
    el.innerHTML = `
      <div style="width:26px; height:26px; border-radius:50%; background:#171515; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 10px rgba(0,0,0,0.35); position:relative;">
        <div style="width:10px; height:10px; border-radius:50%; background:#F62440;"></div>
      </div>
    `;
    return el;
  };

  // ─── Initialize Mapbox map ───────────────────────────────────
  useEffect(() => {
    if (!hasMapbox || !mapContainerRef.current) return;

    mapboxgl.accessToken = getMapboxAccessToken();

    const initialLat = userLocation?.latitude ?? 20.5937;
    const initialLng = userLocation?.longitude ?? 78.9629;
    const initialZoom = userLocation ? 15 : 4.5;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialLng, initialLat],
      zoom: initialZoom,
      pitch: 30,
      attributionControl: false,
    });

    if (userLocation) {
      hasCenteredOnUserRef.current = true;
    }

    map.on('load', () => {
      setMapLoaded(true);

      // Add route source & layer
      map.addSource('route-corridor', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });

      // Corridor safety buffer line (wider, semi-transparent)
      map.addLayer({
        id: 'route-corridor-buffer',
        type: 'line',
        source: 'route-corridor',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FFE5BF',
          'line-width': 18,
          'line-opacity': 0.65,
        },
      });

      // Active journey route line (dark, crisp)
      map.addLayer({
        id: 'route-corridor-line',
        type: 'line',
        source: 'route-corridor',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#171515',
          'line-width': 4.5,
          'line-opacity': 0.9,
        },
      });
    });

    // Detect manual user panning to release auto-follow
    map.on('dragstart', () => {
      setIsFollowingUser(false);
    });

    mapRef.current = map;

    return () => {
      if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null; }
      if (destMarkerRef.current) { destMarkerRef.current.remove(); destMarkerRef.current = null; }
      if (startMarkerRef.current) { startMarkerRef.current.remove(); startMarkerRef.current = null; }
      map.remove();
      mapRef.current = null;
    };
  }, [hasMapbox]);

  // ─── Update Route Geometry ───────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !routeGeometry) return;

    const source = mapRef.current.getSource('route-corridor') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: routeGeometry,
      });

      // FIT ENTIRE ROUTE when fitRouteOnStart is true (first time only)
      if (fitRouteOnStart && !hasInitialFitRef.current && routeGeometry.coordinates.length > 0) {
        hasInitialFitRef.current = true;
        const bounds = new mapboxgl.LngLatBounds();
        routeGeometry.coordinates.forEach((coord) => bounds.extend(coord));
        // Also include user location and destination in bounds
        if (userLocation) {
          bounds.extend([userLocation.longitude, userLocation.latitude]);
        }
        if (destinationLocation) {
          bounds.extend([destinationLocation.longitude, destinationLocation.latitude]);
        }
        mapRef.current.fitBounds(bounds, {
          padding: { top: 80, bottom: 80, left: 60, right: 60 },
          maxZoom: 15,
          duration: 1500,
        });
        setIsFollowingUser(false);
      }
    }
  }, [routeGeometry, mapLoaded, fitRouteOnStart, userLocation, destinationLocation]);

  // ─── Update User Marker (live position dot during walk) ──────
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !userLocation) return;

    const coords: [number, number] = [userLocation.longitude, userLocation.latitude];

    if (!userMarkerRef.current) {
      const el = isMonitoring ? createUserDotEl() : createStartMarkerEl();
      userMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(coords)
        .addTo(mapRef.current);
    } else {
      userMarkerRef.current.setLngLat(coords);
    }

    if (!hasCenteredOnUserRef.current) {
      hasCenteredOnUserRef.current = true;
      mapRef.current.flyTo({ center: coords, zoom: 15, duration: 1200 });
    } else if (isFollowingUser && isMonitoring) {
      mapRef.current.easeTo({ center: coords, duration: 800 });
    }
  }, [userLocation, mapLoaded, isFollowingUser, isMonitoring]);

  // ─── When monitoring starts, swap user marker to tracking dot and add START marker ────
  const hasSwappedToMonitoringRef = useRef(false);
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !isMonitoring || !userLocation) return;
    if (hasSwappedToMonitoringRef.current) return; // Already swapped
    hasSwappedToMonitoringRef.current = true;

    // Add a START POINT marker at the user's starting position (only once)
    if (!startMarkerRef.current) {
      const startEl = createStartMarkerEl();
      startMarkerRef.current = new mapboxgl.Marker({ element: startEl, anchor: 'center' })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(mapRef.current);
    }

    // Replace user marker with the smaller tracking dot
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      const dotEl = createUserDotEl();
      userMarkerRef.current = new mapboxgl.Marker({ element: dotEl, anchor: 'center' })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(mapRef.current);
    }
  }, [isMonitoring, mapLoaded]);

  // ─── Update Destination Marker ───────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    if (!destinationLocation) {
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }
      return;
    }

    const coords: [number, number] = [destinationLocation.longitude, destinationLocation.latitude];

    if (!destMarkerRef.current) {
      const el = createDestMarkerEl(destinationName);
      destMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(coords)
        .addTo(mapRef.current);
    } else {
      destMarkerRef.current.setLngLat(coords);
    }
  }, [destinationLocation, destinationName, mapLoaded]);

  // ─── Manual Controls ─────────────────────────────────────────
  const handleRecenter = useCallback(() => {
    setIsFollowingUser(true);
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 16,
        duration: 1000,
      });
    }
  }, [userLocation]);

  const handleZoomIn = () => { mapRef.current?.zoomIn({ duration: 300 }); };
  const handleZoomOut = () => { mapRef.current?.zoomOut({ duration: 300 }); };

  const handleRouteOverview = () => {
    if (!mapRef.current || !routeGeometry || routeGeometry.coordinates.length === 0) return;
    setIsFollowingUser(false);
    const bounds = new mapboxgl.LngLatBounds();
    routeGeometry.coordinates.forEach((coord) => bounds.extend(coord));
    if (userLocation) bounds.extend([userLocation.longitude, userLocation.latitude]);
    if (destinationLocation) bounds.extend([destinationLocation.longitude, destinationLocation.latitude]);
    mapRef.current.fitBounds(bounds, { padding: 80, maxZoom: 16, duration: 1000 });
  };

  return (
    <div className={`relative w-full h-full min-h-[350px] overflow-hidden rounded-2xl bg-[#FFFDF9] select-none ${className}`}>
      {/* Real Mapbox Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Fallback Vector Engine when Mapbox Token is not present or offline */}
      {!hasMapbox && (
        <div className="absolute inset-0 bg-[#FFFAF3] flex flex-col items-center justify-center p-6 text-center">
          {/* Subtle Grid Lines & Geographic Contours */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#171515" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {routeGeometry && (
              <path
                d="M 120 450 Q 300 320, 520 220 T 780 140"
                fill="none"
                stroke="#171515"
                strokeWidth="4"
                strokeDasharray="4 4"
              />
            )}
          </svg>

          {/* User Marker Representation in Fallback */}
          <div className="relative z-10 p-5 max-w-md bg-white/80 backdrop-blur-md rounded-2xl border border-[#171515]/10 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#171515] text-white flex items-center justify-center mx-auto mb-3">
              <Compass className="w-6 h-6 text-[#FFE5BF] animate-pulse" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#171515] mb-1">
              Geospatial Corridor Active
            </h4>
            <p className="font-sans text-xs text-[#625B55] mb-3">
              {userLocation
                ? `Tracking: ${userLocation.latitude.toFixed(4)}°N, ${userLocation.longitude.toFixed(4)}°E (Accuracy: ±${Math.round(userLocation.accuracy)}m)`
                : 'Waiting for browser GPS signal...'}
            </p>
            <div className="font-mono text-[10px] text-[#625B55] tracking-wider uppercase px-2.5 py-1 bg-[#FFF2DB] rounded-md inline-block">
              {routeGeometry ? 'Route corridor calculated & monitored' : 'Enter destination to compute route'}
            </div>
          </div>
        </div>
      )}

      {/* Floating Map Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter on my location"
          className={`p-2.5 rounded-xl border shadow-sm transition-colors cursor-pointer ${
            isFollowingUser
              ? 'bg-[#171515] text-[#FFFAF3] border-[#171515]'
              : 'bg-white/90 text-[#171515] border-[#171515]/10 hover:bg-white'
          }`}
        >
          <Navigation className="w-4 h-4" />
        </button>

        {hasMapbox && (
          <>
            <button
              type="button"
              onClick={handleRouteOverview}
              title="Overview of entire route"
              className="p-2.5 rounded-xl bg-white/90 text-[#171515] border border-[#171515]/10 hover:bg-white shadow-sm transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-2.5 rounded-xl bg-white/90 text-[#171515] border border-[#171515]/10 hover:bg-white shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2.5 rounded-xl bg-white/90 text-[#171515] border border-[#171515]/10 hover:bg-white shadow-sm transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Corridor Deviation Warning Pill (Floating Top Left) */}
      {isMonitoring && deviationDistance > 100 && (
        <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-amber-500 text-white font-mono text-[11px] font-bold tracking-wider shadow-md flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>CORRIDOR DEVIATION: +{deviationDistance}M</span>
        </div>
      )}

      {/* CSS for marker animations */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
