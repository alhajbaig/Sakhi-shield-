import React, { useState, useCallback } from 'react';
import type { GeocodedDestination } from '../../services/mapboxService';
import type { Coordinates } from '../../types/journey';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';

interface DestinationSearchProps {
  onSelect: (destination: GeocodedDestination) => void;
  onSearch: (query: string, proximity?: Coordinates) => void;
  results: GeocodedDestination[];
  isSearching: boolean;
  searchError: string | null;
  /** User's current GPS location for proximity-biased search */
  userLocation?: { latitude: number; longitude: number } | null;
  placeholder?: string;
  disabled?: boolean;
}

export const DestinationSearch: React.FC<DestinationSearchProps> = ({
  onSelect,
  onSearch,
  results,
  isSearching,
  searchError,
  userLocation,
  placeholder = 'Search metro station, landmark, or address...',
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    // Pass user location as proximity for nearby results
    const proximity: Coordinates | undefined = userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : undefined;
    onSearch(val, proximity);
  }, [onSearch, userLocation]);

  const handleSelect = (dest: GeocodedDestination) => {
    setQuery(dest.name);
    setIsOpen(false);
    onSelect(dest);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    onSearch('');
  };

  const displayList = query.trim().length >= 2 ? results : [];

  // Determine if we have proximity enabled (for showing an indicator)
  const hasProximity = Boolean(userLocation?.latitude && userLocation?.longitude);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-[#78716C]">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#171515]" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-11 pr-10 py-3.5 bg-white rounded-2xl border border-[#171515]/15 text-sm font-sans text-[#171515] placeholder:text-[#78716C]/60 shadow-xs focus:outline-none focus:border-[#171515] focus:ring-1 focus:ring-[#171515] transition-all disabled:opacity-50"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 p-1 text-[#78716C] hover:text-[#171515] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Proximity indicator */}
      {hasProximity && !isOpen && !query && (
        <div className="mt-1.5 flex items-center gap-1.5 px-1">
          <Navigation className="w-3 h-3 text-emerald-600" />
          <span className="font-sans text-[10px] text-emerald-700">Showing results near your location</span>
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length >= 2 && (displayList.length > 0 || searchError || isSearching) && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#FFFAF3] rounded-2xl border border-[#171515]/15 shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          {isSearching && (
            <div className="p-4 text-xs font-sans text-[#78716C] text-center flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#171515]" />
              <span>Searching nearby locations...</span>
            </div>
          )}

          {!isSearching && searchError && (
            <div className="p-4 text-xs font-sans text-[#78716C] text-center">
              {searchError}
            </div>
          )}

          {displayList.length > 0 && (
            <div className="divide-y divide-[#171515]/5">
              {displayList.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelect(dest)}
                  className="w-full p-3.5 text-left flex items-start gap-3 hover:bg-[#FFF2DB]/80 transition-colors cursor-pointer group"
                >
                  <MapPin className="w-4 h-4 text-[#F62440] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans text-sm font-bold text-[#171515] group-hover:text-[#F62440] truncate">
                        {dest.name}
                      </span>
                      {dest.category && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFE5BF] font-mono text-[9px] uppercase tracking-wider text-[#171515] shrink-0">
                          {dest.category}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-[#78716C] truncate mt-0.5">
                      {dest.fullAddress}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
