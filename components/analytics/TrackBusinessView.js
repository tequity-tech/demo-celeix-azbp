'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/context/AnalyticsContext';

export function TrackBusinessView({ businessId, businessName }) {
  const { trackBusinessView } = useAnalytics();

  useEffect(() => {
    if (businessId) {
      trackBusinessView(businessId, businessName);
    }
  }, [businessId, businessName, trackBusinessView]);

  return null;
}
