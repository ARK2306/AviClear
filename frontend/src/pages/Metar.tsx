import { useState, type FormEvent } from 'react';
import { Search, Radio } from 'lucide-react';
import { getMetar, translateMetar } from '../api/weather';
import type { MetarResponse } from '../types';
import MetarCard from '../components/MetarCard';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { RadarLoader, Skel } from '../components/LoadingSpinner';
import Surface from '../components/Surface';

function MetarSkeleton() {
  return (
    <Surface className="p-7">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skel className="h-10 w-32" /><Skel className="h-6 w-20" />
        </div>
        <Skel className="h-4 w-32" />
      </div>
      <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map(i => <Skel key={i} className="h-24" />)}
      </div>
      <Skel className="mt-5 h-36" />
      <RadarLoader label="Fetching METAR · Connecting to AVWX" />
    </Surface>
  );
}

const RECENT = ['KBNA', 'KATL', 'KJFK'];

export default function MetarPage() {
  const [icao, setIcao] = useState('');
  const [active, setActive] = useState('');
  const [metar, setMetar] = useState<MetarResponse | null>(null);
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function lookup(code: string) {
    const upper = code.trim().toUpperCase();
    if (!upper) return;
    setError('');
    setMetar(null);
    setTranslation('');
    setLoading(true);
    setActive(upper);
    try {
      const [metarData, tData] = await Promise.all([
        getMetar(upper),
        translateMetar(upper),
      ]);
      setMetar(metarData);
      setTranslation(tData);
    } catch {
      setError(`No METAR data found for "${upper}". Verify the ICAO code and try again.`);
      setActive('');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    lookup(icao);
  }

  return (
    <div className="space-y-8">
      {/* Section heading */}
      <div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-ink-400 mb-2 flex items-center gap-2">
          <span className="w-6 h-px bg-accent/60" /> Surface Observations
        </div>
        <h1 className="font-display text-[34px] font-bold text-white tracking-tight">Airport Weather</h1>
        <p className="mt-2 text-[14.5px] text-ink-300 max-w-2xl">
          Look up current METAR observations for any airport worldwide. Reports refresh every 5 minutes.
        </p>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-ink-400">
          <Radio className="w-4 h-4 text-flight-vfr" /> Pulling from AVWX · ADDS
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

      {/* Quick chips */}
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-ink-400 -mt-4">
        <span>Recent:</span>
        {RECENT.map(k => (
          <button
            key={k}
            onClick={() => { setIcao(k); lookup(k); }}
            className={`font-mono px-2 py-0.5 rounded border transition-colors ${
              active === k
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-ink-700/60 text-ink-300 hover:text-white hover:border-ink-600/60'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="max-w-5xl">
        {error && <ErrorMessage message={error} title="Lookup failed" onRetry={() => setError('')} />}
        {loading && <MetarSkeleton />}
        {!loading && !error && metar && (
          <MetarCard metar={metar} translation={translation} />
        )}
      </div>
    </div>
  );
}
