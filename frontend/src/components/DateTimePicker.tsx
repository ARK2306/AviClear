import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
function parseDT(s: string): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(s);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
}
function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function TimeSpin({
  value,
  setValue,
  max,
  step = 1,
}: {
  value: string;
  setValue: (v: string) => void;
  max: number;
  step?: number;
}) {
  const bump = (n: number) => {
    let v = (parseInt(value, 10) || 0) + n;
    if (v < 0) v = max;
    if (v > max) v = 0;
    setValue(pad2(v));
  };
  return (
    <div className="flex items-center rounded-md border border-ink-700/60 bg-ink-950/60 overflow-hidden">
      <button type="button" onClick={() => bump(-step)} className="w-6 h-8 text-ink-400 hover:text-white hover:bg-ink-800 transition-colors">−</button>
      <input
        value={value}
        onChange={e => setValue(e.target.value.replace(/\D/g, '').slice(0, 2))}
        onBlur={e => setValue(pad2(clamp(parseInt(e.target.value, 10) || 0, 0, max)))}
        className="w-9 h-8 bg-transparent text-center font-mono text-[14px] text-white tnum focus:outline-none"
        maxLength={2}
      />
      <button type="button" onClick={() => bump(step)} className="w-6 h-8 text-ink-400 hover:text-white hover:bg-ink-800 transition-colors">+</button>
    </div>
  );
}

function Chip({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? 'px-2.5 h-7 rounded-md text-[11.5px] font-medium border border-accent/60 bg-accent/15 text-white hover:bg-accent/25 transition-colors'
          : 'px-2.5 h-7 rounded-md text-[11.5px] font-medium border border-ink-700/60 text-ink-300 hover:text-white hover:border-ink-600/60 hover:bg-ink-800/60 transition-colors'
      }
    >
      {children}
    </button>
  );
}

export default function DateTimePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const parsed = parseDT(value) ?? new Date();
  const [viewMonth, setViewMonth] = useState(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
  const [hh, setHh] = useState(pad2(parsed.getHours()));
  const [mm, setMm] = useState(pad2(parsed.getMinutes()));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  useEffect(() => {
    const d = parseDT(value);
    if (!d) return;
    setHh(pad2(d.getHours()));
    setMm(pad2(d.getMinutes()));
  }, [value]);

  const emit = (d: Date, h = hh, m = mm) => {
    const hN = clamp(parseInt(h, 10) || 0, 0, 23);
    const mN = clamp(parseInt(m, 10) || 0, 0, 59);
    onChange(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(hN)}:${pad2(mN)}`);
  };

  const bump = (mins: number) => {
    const d = parseDT(value) ?? new Date();
    d.setMinutes(d.getMinutes() + mins);
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    setHh(pad2(d.getHours()));
    setMm(pad2(d.getMinutes()));
    emit(d, pad2(d.getHours()), pad2(d.getMinutes()));
  };

  const setNow = () => {
    const n = new Date();
    setViewMonth(new Date(n.getFullYear(), n.getMonth(), 1));
    setHh(pad2(n.getHours()));
    setMm(pad2(n.getMinutes()));
    emit(n, pad2(n.getHours()), pad2(n.getMinutes()));
  };

  // Build calendar grid (Sun-first)
  const startDow = viewMonth.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const prevDays = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0).getDate();
  const cells: { d: Date; out: boolean }[] = [];
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ d: new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, prevDays - i), out: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ d: new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i), out: false });
  }
  while (cells.length % 7 !== 0 || cells.length < 35) {
    const last = cells[cells.length - 1].d;
    cells.push({ d: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), out: true });
  }

  const sel = parseDT(value);
  const today = new Date();
  const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const display = sel
    ? `${sel.getFullYear()}-${pad2(sel.getMonth() + 1)}-${pad2(sel.getDate())}  ${pad2(sel.getHours())}:${pad2(sel.getMinutes())}`
    : 'Select date & time';
  const dowLabel = sel ? sel.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() : '';

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`field w-full h-12 px-3.5 rounded-lg text-left flex items-center gap-3 whitespace-nowrap ${open ? '!border-accent/55 !shadow-[0_0_0_3px_rgba(59,130,246,.18)]' : ''}`}
      >
        <Calendar className="w-4 h-4 text-accent/90 flex-shrink-0" />
        <span className="font-mono tnum text-[14px] text-ink-100">{display}</span>
        {dowLabel && (
          <span className="ml-1 text-[10.5px] font-mono text-ink-400 px-1.5 py-0.5 rounded bg-ink-900/60 ring-1 ring-ink-700/60">
            {dowLabel}
          </span>
        )}
        <span className="ml-auto text-[10px] text-ink-500 font-mono">Z</span>
        <ChevronDown className={`w-3.5 h-3.5 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-[340px] rounded-xl border border-ink-700/60 bg-ink-850 backdrop-blur shadow-card overflow-hidden animate-fadeUp">
          {/* Month nav */}
          <div className="flex items-center justify-between px-3 h-11 border-b border-ink-700/50 bg-ink-900/60">
            <button
              type="button"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              className="w-7 h-7 rounded-md flex items-center justify-center text-ink-300 hover:text-white hover:bg-ink-800 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="font-display text-[13.5px] font-semibold text-white tracking-wide tnum">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              className="w-7 h-7 rounded-md flex items-center justify-center text-ink-300 hover:text-white hover:bg-ink-800 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 pt-2.5 pb-1 text-[10px] font-mono text-ink-500 tracking-[0.16em]">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {cells.map((c, i) => {
              const selected = sameDay(c.d, sel);
              const isToday = sameDay(c.d, today);
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => emit(c.d)}
                  className={`h-8 w-8 mx-auto rounded-md font-mono text-[12.5px] tnum transition-colors relative
                    ${c.out ? 'text-ink-600' : 'text-ink-200 hover:bg-ink-800/70 hover:text-white'}
                    ${selected ? '!bg-accent/20 ring-1 ring-accent/60 !text-white' : ''}
                  `}
                >
                  {c.d.getDate()}
                  {isToday && !selected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Time + quick chips */}
          <div className="border-t border-ink-700/50 bg-ink-900/40 px-3 py-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-400">Time</span>
              <div className="flex items-center gap-1 ml-auto">
                <TimeSpin value={hh} setValue={v => { setHh(v); if (sel) emit(sel, v, mm); }} max={23} />
                <span className="text-ink-400 font-mono">:</span>
                <TimeSpin value={mm} setValue={v => { setMm(v); if (sel) emit(sel, hh, v); }} max={59} step={5} />
                <span className="ml-1 text-[10.5px] font-mono text-ink-400">Z</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Chip onClick={setNow}>Now</Chip>
              <Chip onClick={() => bump(60)}>+1h</Chip>
              <Chip onClick={() => bump(180)}>+3h</Chip>
              <Chip onClick={() => bump(24 * 60)}>+1d</Chip>
              <Chip onClick={() => setOpen(false)} primary>Done</Chip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
