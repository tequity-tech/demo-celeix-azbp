'use client';

import { useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
// Leaflet CSS is imported globally in app/globals.css
import Link from 'next/link';
import { MapPin, BadgeCheck } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (isFeatured = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 rounded-full ${isFeatured ? 'bg-[#d4a528]' : 'bg-[#a67c52]'} shadow-lg flex items-center justify-center border-2 border-white">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function MapUpdater({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, map]);

  return null;
}

export default function MapInner({
  businesses = [],
  center = { lat: 33.4484, lng: -112.0740 }, // Phoenix default
  zoom = 10,
  onMarkerClick,
  selectedBusinessId,
  className = '',
}) {
  return (
    <LeafletMap
      center={[center.lat, center.lng]}
      zoom={zoom}
      className={`h-full w-full ${className}`}
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater center={center} zoom={zoom} />

      {businesses.map((business) => {
        if (!business.latitude || !business.longitude) return null;

        return (
          <Marker
            key={business.id}
            position={[business.latitude, business.longitude]}
            icon={createCustomIcon(business.is_featured)}
            eventHandlers={{
              click: () => onMarkerClick?.(business),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <Link href={`/directory/${business.slug}`} className="block group">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-semibold text-[var(--color-neutral-900)] group-hover:text-[var(--color-primary-500)]">
                      {business.name}
                    </h3>
                    {business.is_verified && (
                      <BadgeCheck className="w-4 h-4 text-[var(--color-accent-500)] flex-shrink-0" />
                    )}
                  </div>
                  {business.category_names && (
                    <p className="text-sm text-[var(--color-primary-500)] mb-1">
                      {business.category_names}
                    </p>
                  )}
                  <p className="text-sm text-[var(--color-neutral-500)]">
                    {business.city}, AZ
                  </p>
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </LeafletMap>
  );
}
