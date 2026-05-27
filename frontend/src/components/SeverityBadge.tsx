import clsx from 'clsx';
import { AlertTriangle } from 'lucide-react';
import type { NotamSeverity } from '../types';

const CONFIG: Record<NotamSeverity, { bg: string; ring: string; text: string }> = {
  CRITICAL:    { bg: 'bg-sev-critical/10',    ring: 'ring-sev-critical/45',    text: 'text-sev-critical'    },
  SIGNIFICANT: { bg: 'bg-sev-significant/10', ring: 'ring-sev-significant/45', text: 'text-sev-significant' },
  ROUTINE:     { bg: 'bg-ink-700/40',         ring: 'ring-ink-500/50',         text: 'text-ink-300'         },
};

export default function SeverityBadge({ severity }: { severity: NotamSeverity }) {
  const cfg = CONFIG[severity] ?? CONFIG.ROUTINE;
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-bold tracking-[0.14em] ring-1',
        cfg.bg, cfg.ring, cfg.text
      )}
    >
      {severity === 'CRITICAL'    && <AlertTriangle className="w-3 h-3" />}
      {severity === 'SIGNIFICANT' && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {severity === 'ROUTINE'     && <span className="w-1.5 h-1.5 rounded-sm bg-current/60" />}
      {severity}
    </span>
  );
}
