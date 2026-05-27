import { useState, type FormEvent } from 'react';
import { Search, Radio } from 'lucide-react';
import { classifyNotams } from '../api/notams';
import type { NotamBriefing, NotamSeverity } from '../types';
import NotamCard from '../components/NotamCard';
import SeverityBadge from '../components/SeverityBadge';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { RadarLoader, Skel } from '../components/LoadingSpinner';
import Surface from '../components/Surface';

const SEV_ORDER: NotamSeverity[] = ['CRITICAL', 'SIGNIFICANT', 'ROUTINE'];
const SEV_COLORS: Record<NotamSeverity, string> = {
  CRITICAL: 'text-sev-critical',
  SIGNIFICANT: 'text-sev-significant',
  ROUTINE: 'text-ink-300',
};

function NotamSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map(i => (
        <Surface key={i} className="p-5">
          <div className="flex items-center gap-3 mb-3"><Skel className="h-5 w-24" /><Skel className="h-4 w-20" /></div>
          <Skel className="h-4 w-full mb-1.5" /><Skel className="h-4 w-[85%]" />
          <div className="mt-4 flex gap-4"><Skel className="h-3 w-32" /><Skel className="h-3 w-32" /></div>
        </Surface>
      ))}
      <RadarLoader label="Classifying NOTAMs · AI analysis in progress" />
    </div>
  );
}

type Filter = 'ALL' | NotamSeverity;

export default function NotamsPage() {
  const [icao, setIcao] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [notams, setNotams] = useState<NotamBriefing[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const upper = (icao || '').trim().toUpperCase();
    if (!upper) return;
    setError('');
    setNotams(null);
    setLoading(true);
    setSubmitted(upper);
    setFilter('ALL');
    try {
      const data = await classifyNotams(upper);
      setNotams(data);
    } catch {
      setError(`Could not retrieve NOTAMs for "${upper}". Verify the ICAO code and try again.`);
    } finally {
      setLoading(false);
    }
  }

  const counts = notams
    ? {
        CRITICAL:    notams.filter(n => n.severity === 'CRITICAL').length,
        SIGNIFICANT: notams.filter(n => n.severity === 'SIGNIFICANT').length,
        ROUTINE:     notams.filter(n => n.severity === 'ROUTINE').length,
      }
    : null;

  const groups = notams
    ? SEV_ORDER
        .map(k => ({ key: k, items: notams.filter(n => n.severity === k) }))
        .filter(g => g.items.length > 0)
    : [];

  const visibleGroups = filter === 'ALL' ? groups : groups.filter(g => g.key === filter);

  return (
    <div className="space-y-8">
      {/* Section heading */}
      <div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-ink-400 mb-2 flex items-center gap-2">
          <span className="w-6 h-px bg-accent/60" /> Notices to Airmen
        </div>
        <h1 className="font-display text-[34px] font-bold text-white tracking-tight">NOTAMs</h1>
        <p className="mt-2 text-[14.5px] text-ink-300 max-w-2xl">
          AI-classified notices to airmen for any airport. Severity ordering surfaces what matters most for your flight.
        </p>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-ink-400">
          <Radio className="w-4 h-4 text-flight-vfr" /> AI-classified · FAA NOTAM feed
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-3xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <input
            className="field w-full h-12 pl-11 pr-4 rounded-lg text-[16px] font-mono tracking-[0.25em] uppercase tnum"
            type="text"
            value={icao}
            onChange={e => setIcao(e.target.value.toUpperCase())}
            placeholder="ICAO code — e.g. KBNA"
            maxLength={4}
          />
        </div>
        <Button type="submit" size="lg" icon={Search} loading={loading}>Look Up</Button>
      </form>

      {error && <ErrorMessage message={error} title="Lookup failed" onRetry={() => setError('')} />}
      {loading && <NotamSkeleton />}

      {!loading && notams && counts && (
        <div className="space-y-8 max-w-5xl">
          {/* Summary strip + filters */}
          <div className="flex items-center flex-wrap gap-3">
            <div className="text-[13px] text-ink-300">
              <span className="text-white font-semibold tnum">{notams.length}</span> NOTAMs found for{' '}
              <span className="font-mono text-white">{submitted}</span>
            </div>
            <div className="h-4 w-px bg-ink-700" />
            {([
              { k: 'ALL' as Filter,         label: 'All',         count: notams.length,         color: 'text-ink-200' },
              { k: 'CRITICAL' as Filter,    label: 'Critical',    count: counts.CRITICAL,        color: 'text-sev-critical' },
              { k: 'SIGNIFICANT' as Filter, label: 'Significant', count: counts.SIGNIFICANT,     color: 'text-sev-significant' },
              { k: 'ROUTINE' as Filter,     label: 'Routine',     count: counts.ROUTINE,         color: 'text-ink-300' },
            ]).map(({ k, label, count, color }) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-3 h-8 rounded-lg text-[12.5px] border transition-colors flex items-center gap-2 ${
                  filter === k
                    ? 'border-accent/40 bg-accent/10'
                    : 'border-ink-700/60 hover:border-ink-600/60'
                }`}
              >
                <span className={color}>{label}</span>
                <span className="tnum text-ink-400">{count}</span>
              </button>
            ))}
          </div>

          {notams.length === 0 && (
            <Surface className="p-8 text-center text-ink-400">
              No active NOTAMs found for {submitted}.
            </Surface>
          )}

          {/* Grouped NOTAM list */}
          {visibleGroups.map(g => (
            <section key={g.key} className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className={`text-[11px] uppercase tracking-[0.22em] font-semibold ${SEV_COLORS[g.key]}`}>
                  {g.key}
                </h3>
                <SeverityBadge severity={g.key} />
                <span className="flex-1 h-px bg-gradient-to-r from-ink-700/40 to-transparent" />
              </div>
              {g.items.map(n => <NotamCard key={n.notam.notamId} item={n} />)}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
