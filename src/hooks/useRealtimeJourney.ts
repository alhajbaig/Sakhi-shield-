// Walk With Me - Custom Hook: useRealtimeJourney
// Realtime sync via Supabase Realtime Channels with unmount cleanup guarantee

import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Journey, JourneyEvent } from '../types/journey';

interface UseRealtimeJourneyProps {
  journeyId: string | null;
  onRemoteJourneyUpdate?: (journey: Partial<Journey>) => void;
  onRemoteEvent?: (event: JourneyEvent) => void;
}

export const useRealtimeJourney = ({
  journeyId,
  onRemoteJourneyUpdate,
  onRemoteEvent,
}: UseRealtimeJourneyProps) => {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!journeyId || !isSupabaseConfigured()) return;

    const channelName = `journey_sync_${journeyId}`;
    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    // Listen to journey updates
    channel
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'journeys',
          filter: `id=eq.${journeyId}`,
        },
        (payload) => {
          if (payload.new) {
            onRemoteJourneyUpdate?.(payload.new as Partial<Journey>);
          }
        }
      )
      // Listen to new events
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'journey_events',
          filter: `journey_id=eq.${journeyId}`,
        },
        (payload) => {
          if (payload.new) {
            onRemoteEvent?.(payload.new as JourneyEvent);
          }
        }
      )
      .subscribe();

    return () => {
      // Mandatory cleanup (Section 38)
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [journeyId, onRemoteJourneyUpdate, onRemoteEvent]);
};
