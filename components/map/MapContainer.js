'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui';

// Dynamically import the map to avoid SSR issues with Leaflet
const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-[var(--color-neutral-100)]">
      <Spinner size="lg" />
    </div>
  ),
});

export function MapContainer(props) {
  return <MapInner {...props} />;
}
