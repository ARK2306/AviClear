import { useState, type FormEvent } from 'react';
import { Sparkles, ArrowRight, FileText } from 'lucide-react';
import { getBriefing } from '../api/briefing';
import type { BriefingResponse, NotamBriefing, NotamSeverity } from '../types';
import MetarCard from '../components/MetarCard';
import SeverityBadge from '../components/SeverityBadge';
import FlightCategoryBadge from '../components/FlightCategoryBadge';
import DateTimePicker from '../components/DateTimePicker';
import Button from '../components/Button';
import Surface from '../components/Surface';
import ErrorMessage from '../components/ErrorMessage';
import { RadarLoader, Skel } from '../components/LoadingSpinner';

/* ── Default departure time (now + 1h, rounded) ─────────────── */
function defaultTime(): string {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:00`;
}
function pad2(n: number) { return String(n).padStart(2, '0'); }

/* ── Skeleton ────────────────────────────────────────────────── */
function BriefingSkeleton() {
  return (
    <div className="space-y-6">
      <Surface className="p-6"><Skel className="h-12 w-full" /></Surface>
      <Surface className="p-7">
        <Skel className="h-6 w-48 mb-4" />
        <Skel className="h-4 w-full mb-2" />
        <Skel className="h-4 w-[90%] mb-2" />
        <Skel className="h-4 w-[60%]" />
      </Surface>
      <div className="grid lg:grid-cols-2 gap-6">
        {[0, 1].map(i => <Surface key={i} className="p-5"><Skel className="h-36" /></Surface>)}
      </div>
      <RadarLoader label="Generating AI preflight briefing" />
    </div>
  );
}

/* ── Compact NOTAM row (for briefing columns) ────────────────── */
const NOTAM_EDGE: Record<NotamSeverity, string> = {
  CRITICAL:    'border-l-sev-critical',
  SIGNIFICANT: 'border-l-sev-significant',
  ROUTINE:     'border-l-ink-500',
};

function NotamRow({ item }: { item: NotamBriefing }) {
  return (
    <div className={`rounded-lg border-l-2 ${NOTAM_EDGE[item.severity]} bg-ink-900/40 p-3.5`}>
      <div className="flex items-center gap-2 mb-1.5">
        <SeverityBadge severity={item.severity} />
        <span className="font-mono text-[10.5px] text-ink-500">{item.notam.notamId}</span>
      </div>
      <p className="text-[13px] text-ink-100 leading-relaxed">{item.summary}</p>
    </div>
  );
}

/* ── Route block ─────────────────────────────────────────────── */
function RouteBlock({ icao, cat, name, side }: { icao: string; cat: string; name: string; side: 'dep' | 'dest' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[10.5px] uppercase tracking-[0.18em] text-ink-400 hidden sm:block">
        {side === 'dep' ? 'From' : 'To'}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-[24px] text-white">{icao}</span>
          <FlightCategoryBadge category={cat} size="sm" />
        </div>
        <div className="text-[12px] text-ink-400 truncate max-w-[180px]">{name}</div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function BriefingPage() {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState(defaultTime);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!departure.trim() || !destination.trim()) return;
    setError('');
    setBriefing(null);
    setLoading(true);
    try {
      const data = await getBriefing(departure.trim(), destination.trim(), departureTime);
      setBriefing(data);
    } catch {
      setError('Unable to generate briefing. Check your inputs and ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Section heading */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-400 mb-2 flex items-center gap-2">
            <span className="w-6 h-px bg-accent/60" /> Mission Brief
          </div>
          <h1 className="font-display text-[34px] font-bold text-white tracking-tight">Preflight Briefing</h1>
          <p className="mt-2 text-[14.5px] text-ink-300 max-w-2xl">
            Complete AI-powered briefing for your planned flight — weather, NOTAMs, and an integrated narrative summary.
          </p>
        </div>
        {briefing && (
          <Button variant="secondary" size="sm" icon={FileText}>Export PDF</Button>
        )}
      </div>

      {/* Form */}
      <Surface className="p-6 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:items-end">
            <label className="block">
              <span className="text-[11.5px] uppercase tracking-[0.16em] text-ink-300 font-semibold block mb-1.5">
                Departure
              </span>
              <input
                className="field w-full h-12 px-4 rounded-lg text-[16px] font-mono tracking-[0.25em] uppercase tnum"
                type="text"
                value={departure}
                onChange={e => setDeparture(e.target.value.toUpperCase())}
                placeholder="KBNA"
                maxLength={4}
                required
              />
            </label>
            <div className="hidden md:flex items-center justify-center pb-3 text-accent">
              <ArrowRight className="w-5 h-5" />
            </div>
            <label className="block">
              <span className="text-[11.5px] uppercase tracking-[0.16em] text-ink-300 font-semibold block mb-1.5">
                Destination
              </span>
              <input
                className="field w-full h-12 px-4 rounded-lg text-[16px] font-mono tracking-[0.25em] uppercase tnum"
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value.toUpperCase())}
                placeholder="KATL"
                maxLength={4}
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-4 items-end">
            <label className="block">
              <span className="text-[11.5px] uppercase tracking-[0.16em] text-ink-300 font-semibold block mb-1.5">
                Departure Time
              </span>
              <DateTimePicker value={departureTime} onChange={setDepartureTime} />
            </label>
            <Button
              type="submit"
              size="lg"
              icon={Sparkles}
              loading={loading}
              disabled={!departure.trim() || !destination.trim()}
            >
              Generate
            </Button>
          </div>
        </form>
      </Surface>

      {error && <ErrorMessage message={error} title="Briefing failed" onRetry={() => setError('')} />}
      {loading && <BriefingSkeleton />}

      {!loading && briefing && (
        <div className="space-y-6 max-w-6xl animate-fadeUp">
          {/* Route header */}
          <Surface className="p-6 corners">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <RouteBlock
                  icao={briefing.departure}
                  cat={briefing.departureMetar?.fltCat ?? ''}
                  name={briefing.departureMetar?.name ?? briefing.departure}
                  side="dep"
                />
                <div className="flex flex-col items-center gap-1 min-w-[120px]">
                  <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink-400">Route</div>
                  <div className="flex items-center gap-2 w-full">
                    <span className="w-2 h-2 rounded-full bg-flight-vfr" />
                    <span className="flex-1 h-px border-t border-dashed border-accent/40" />
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.8 19.2 16 11l3.5-3.5a2.121 2.121 0 1 0-3-3L13 8 4.8 6.2c-.5-.1-.9.2-.9.7v.3l3.4 4-2 .7-1.5-1L3 11l2 2 2 2 1.1-.8-1-1.5.7-2 4 3.4h.3c.5 0 .8-.4.7-.9z" />
                    </svg>
                    <span className="flex-1 h-px border-t border-dashed border-accent/40" />
                    <span className="w-2 h-2 rounded-full bg-flight-mvfr" />
                  </div>
                </div>
                <RouteBlock
                  icao={briefing.destination}
                  cat={briefing.arrivalMetar?.fltCat ?? ''}
                  name={briefing.arrivalMetar?.name ?? briefing.destination}
                  side="dest"
                />
              </div>
              <div className="text-left md:text-right text-[12px] text-ink-400">
                <div className="uppercase tracking-[0.18em] text-[10.5px]">Departure (Z)</div>
                <div className="font-mono text-[14px] text-white tnum">
                  {briefing.departureTime.replace('T', ' ')}Z
                </div>
              </div>
            </div>
          </Surface>

          {/* AI narrative */}
          <Surface className="p-7">
            <div className="flex items-center gap-2.5 text-[11.5px] uppercase tracking-[0.22em] text-accent mb-5">
              <Sparkles className="w-4 h-4" />
              AI Preflight Narrative
            </div>
            <p className="text-[14.5px] leading-relaxed text-ink-100 whitespace-pre-line max-w-3xl">
              {briefing.briefing}
            </p>
          </Surface>

          {/* Weather columns */}
          <div className="grid lg:grid-cols-2 gap-6">
            {briefing.departureMetar && (
              <div className="space-y-2">
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink-400">Departure Weather</div>
                <MetarCard metar={briefing.departureMetar} compact />
              </div>
            )}
            {briefing.arrivalMetar && (
              <div className="space-y-2">
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink-400">Destination Weather</div>
                <MetarCard metar={briefing.arrivalMetar} compact />
              </div>
            )}
          </div>

          {/* NOTAM columns */}
          {((briefing.departureNotams?.length ?? 0) > 0 || (briefing.destinationNotams?.length ?? 0) > 0) && (
            <div className="grid lg:grid-cols-2 gap-6">
              {briefing.departureNotams && briefing.departureNotams.length > 0 && (
                <Surface className="p-5">
                  <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink-400 mb-4">
                    Departure NOTAMs ({briefing.departure})
                  </div>
                  <div className="space-y-3">
                    {briefing.departureNotams.map(n => <NotamRow key={n.notam.notamId} item={n} />)}
                  </div>
                </Surface>
              )}
              {briefing.destinationNotams && briefing.destinationNotams.length > 0 && (
                <Surface className="p-5">
                  <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink-400 mb-4">
                    Destination NOTAMs ({briefing.destination})
                  </div>
                  <div className="space-y-3">
                    {briefing.destinationNotams.map(n => <NotamRow key={n.notam.notamId} item={n} />)}
                  </div>
                </Surface>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
