'use client';

import { useAnalytics } from '@/context/AnalyticsContext';

export function TrackedPhoneLink({ businessId, phone, children, className }) {
  const { trackPhoneClick } = useAnalytics();

  const handleClick = () => {
    trackPhoneClick(businessId, phone);
  };

  return (
    <a
      href={`tel:${phone}`}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}

export function TrackedEmailLink({ businessId, email, children, className }) {
  const { trackEmailClick } = useAnalytics();

  const handleClick = () => {
    trackEmailClick(businessId, email);
  };

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}

export function TrackedWebsiteLink({ businessId, url, children, className }) {
  const { trackWebsiteClick } = useAnalytics();

  const handleClick = () => {
    trackWebsiteClick(businessId, url);
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
