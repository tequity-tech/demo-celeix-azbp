'use client';

import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { nanoid } from 'nanoid';

const AnalyticsContext = createContext(null);

// Generate or retrieve session ID
function getSessionId() {
  if (typeof window === 'undefined') return null;

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = nanoid();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

export function AnalyticsProvider({ children }) {
  const pathname = usePathname();
  const lastTrackedPath = useRef(null);

  // Track page view
  const trackPageView = useCallback(async (pagePath) => {
    try {
      const sessionId = getSessionId();
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'page_view',
          pagePath,
          sessionId,
          referrer: typeof document !== 'undefined' ? document.referrer : null,
        }),
      });
    } catch (error) {
      // Silently fail - don't break the app for analytics
      console.debug('Analytics tracking failed:', error);
    }
  }, []);

  // Track business view
  const trackBusinessView = useCallback(async (businessId, businessName) => {
    try {
      const sessionId = getSessionId();
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'business_view',
          businessId,
          sessionId,
          metadata: { businessName },
        }),
      });
    } catch (error) {
      console.debug('Analytics tracking failed:', error);
    }
  }, []);

  // Track website click
  const trackWebsiteClick = useCallback(async (businessId, url) => {
    try {
      const sessionId = getSessionId();
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'website_click',
          businessId,
          sessionId,
          metadata: { url },
        }),
      });
    } catch (error) {
      console.debug('Analytics tracking failed:', error);
    }
  }, []);

  // Track phone click
  const trackPhoneClick = useCallback(async (businessId, phone) => {
    try {
      const sessionId = getSessionId();
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'phone_click',
          businessId,
          sessionId,
          metadata: { phone },
        }),
      });
    } catch (error) {
      console.debug('Analytics tracking failed:', error);
    }
  }, []);

  // Track email click
  const trackEmailClick = useCallback(async (businessId, email) => {
    try {
      const sessionId = getSessionId();
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'email_click',
          businessId,
          sessionId,
          metadata: { email },
        }),
      });
    } catch (error) {
      console.debug('Analytics tracking failed:', error);
    }
  }, []);

  // Track search
  const trackSearch = useCallback(async (query, resultsCount) => {
    try {
      const sessionId = getSessionId();
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'search',
          sessionId,
          metadata: { query, resultsCount },
        }),
      });
    } catch (error) {
      console.debug('Analytics tracking failed:', error);
    }
  }, []);

  // Track map view
  const trackMapView = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'map_view',
          pagePath: '/map',
          sessionId,
        }),
      });
    } catch (error) {
      console.debug('Analytics tracking failed:', error);
    }
  }, []);

  // Auto-track page views on route change
  useEffect(() => {
    if (pathname && pathname !== lastTrackedPath.current) {
      lastTrackedPath.current = pathname;
      trackPageView(pathname);
    }
  }, [pathname, trackPageView]);

  const value = {
    trackPageView,
    trackBusinessView,
    trackWebsiteClick,
    trackPhoneClick,
    trackEmailClick,
    trackSearch,
    trackMapView,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    // Return no-op functions if not wrapped in provider
    return {
      trackPageView: () => {},
      trackBusinessView: () => {},
      trackWebsiteClick: () => {},
      trackPhoneClick: () => {},
      trackEmailClick: () => {},
      trackSearch: () => {},
      trackMapView: () => {},
    };
  }
  return context;
}
