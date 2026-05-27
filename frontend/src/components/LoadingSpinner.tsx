/* Radar sweep loader + shimmer skeleton primitives */

export function RadarLoader({ label = 'Fetching data…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 py-8">
      <div className="w-9 h-9 radar ring-1 ring-ink-700/40 flex-shrink-0">
        <div className="absolute inset-1 rounded-full bg-ink-900" />
      </div>
      <span className="text-[12.5px] text-ink-400 font-mono tracking-wide">{label.toUpperCase()}</span>
    </div>
  );
}

export function Skel({ className = '' }: { className?: string }) {
  return <div className={`rounded shimmer ${className}`} />;
}

/* Backwards-compat default export for the old LoadingSpinner usages */
export default function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
  return <RadarLoader label={label} />;
}
