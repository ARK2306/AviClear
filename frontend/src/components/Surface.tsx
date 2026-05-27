import clsx from 'clsx';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  corners?: boolean;
  glow?: string;
}

export default function Surface({ children, className = '', corners = false, glow = '' }: Props) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-ink-700/50 bg-ink-800/60 shadow-card',
        corners && 'corners',
        glow,
        className
      )}
    >
      {children}
    </div>
  );
}
