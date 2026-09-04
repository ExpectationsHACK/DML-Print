export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
      <path
        d="M6 10.2l2.5 2.5L14 7.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77L1.62 7.59l5.79-.84L10 1.5z" />
    </svg>
  );
}

export function LogoMark({
  className,
  animated,
}: {
  className?: string;
  /** Pulses each bar on a stagger — used for loading states. */
  animated?: boolean;
}) {
  return (
    <span
      className={className}
      role={animated ? "status" : undefined}
      aria-label={animated ? "Loading" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--forest)",
        borderRadius: animated ? 12 : 8,
      }}
      aria-hidden={animated ? undefined : "true"}
    >
      <svg viewBox="0 0 24 24" width="68%" height="68%" fill="none">
        <rect
          x="6" y="4.5" width="12" height="4" rx="1.5" fill="#E4392E"
          className={animated ? "animate-pulse" : undefined}
          style={animated ? { animationDelay: "0ms" } : undefined}
        />
        <rect
          x="4" y="10" width="16" height="4" rx="1.5" fill="#F2C230"
          className={animated ? "animate-pulse" : undefined}
          style={animated ? { animationDelay: "150ms" } : undefined}
        />
        <rect
          x="6" y="15.5" width="12" height="4" rx="1.5" fill="#1E9DD8"
          className={animated ? "animate-pulse" : undefined}
          style={animated ? { animationDelay: "300ms" } : undefined}
        />
      </svg>
    </span>
  );
}
