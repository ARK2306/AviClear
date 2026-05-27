import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import Surface from './Surface';
import type { NotamBriefing, NotamSeverity } from '../types';

const EDGE: Record<NotamSeverity, string> = {
  CRITICAL:    'border-l-sev-critical',
  SIGNIFICANT: 'border-l-sev-significant',
  ROUTINE:     'border-l-ink-500',
};

function fmtDate(iso: string | null): string {
  if (!iso) return '–';
  try {
    return new Date(iso).toISOString().slice(0, 16).replace('T', ' ').replace(/-/g, '') + 'Z';
  } catch {
    return iso;
  }
}

export default function NotamCard({ item }: { item: NotamBriefing }) {
  const [open, setOpen] = useState(false);
  const edge = EDGE[item.severity] ?? EDGE.ROUTINE;

  return (
    <Surface className={clsx('p-5 border-l-2', edge)}>
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <SeverityBadge severity={item.severity} />
        <span className="font-mono text-[11.5px] text-ink-400">{item.notam.notamId}</span>
      </div>

      <p className="text-[14px] text-ink-100 leading-relaxed">{item.summary}</p>

      <div className="mt-3 flex items-center gap-5 text-[11.5px] font-mono tnum text-ink-400">
        {item.notam.effective && (
          <span><span className="text-ink-500">EFF</span> {fmtDate(item.notam.effective)}</span>
        )}
        {item.notam.expiration && (
          <span><span className="text-ink-500">EXP</span> {fmtDate(item.notam.expiration)}</span>
        )}
      </div>

      <button
        onClick={() => setOpen(o => !o)}
        className="mt-3 flex items-center gap-1.5 text-[12px] text-ink-400 hover:text-ink-200 transition-colors"
      >
        <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform', open ? '' : '-rotate-90')} />
        Raw NOTAM
      </button>

      {open && (
        <pre className="mt-2 p-3 rounded-lg border border-ink-700/60 bg-ink-950/60 text-[12px] font-mono text-ink-100 leading-relaxed whitespace-pre-wrap break-all">
          {item.notam.raw || item.notam.body}
        </pre>
      )}
    </Surface>
  );
}
