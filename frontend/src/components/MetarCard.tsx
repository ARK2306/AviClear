import { useState } from 'react';
import { Wind, Eye, Thermometer, Gauge, Layers, Sparkles, ChevronDown } from 'lucide-react';
import type { MetarResponse } from '../types';
import FlightCategoryBadge from './FlightCategoryBadge';
import Surface from './Surface';

/* ── helpers ─────────────────────────────────────────────────── */
function pad3(n: number) { return String(Math.round(n)).padStart(3, '0'); }

function altimDisplay(altim: number | null): { primary: string; secondary: string } | null {
  if (altim == null) return null;
  if (altim > 100) {
    return { primary: (altim / 33.8639).toFixed(2) + ' inHg', secondary: altim.toFixed(1) + ' hPa' };
  }
  return { primary: altim.toFixed(2) + ' inHg', secondary: (altim * 33.8639).toFixed(1) + ' hPa' };
}

function visibDisplay(v: number | null): string {
  if (v == null) return 'N/A';
  return v >= 10 ? '10+ SM' : `${v} SM`;
}

/* ── WindRose ────────────────────────────────────────────────── */
function WindRose({ dir }: { dir: number }) {
  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(59,130,246,.15)" strokeWidth="1" />
        <circle cx="16" cy="16" r="10" fill="none" stroke="rgba(59,130,246,.1)" strokeWidth="1" />
        <text x="16" y="6" textAnchor="middle" fontSize="4" fill="#5b6a8a" fontFamily="JetBrains Mono">N</text>
        <g transform={`rotate(${dir} 16 16)`}>
          <path d="M16 6 L13 18 L16 16 L19 18 Z" fill="#3b82f6" />
        </g>
      </svg>
    </div>
  );
}

/* ── InstrumentTile ──────────────────────────────────────────── */
function InstrumentTile({
  icon: Icon,
  label,
  value,
  sub,
  extra,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ink-700/50 bg-gradient-to-b from-ink-800/80 to-ink-850/80 p-4">
      <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.18em] text-ink-400">
        <span className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-accent/80" />
          {label}
        </span>
        {extra}
      </div>
      <div className="mt-3 font-display text-[26px] font-bold text-white tnum leading-none">{value}</div>
      <div className="mt-1.5 text-[12px] text-ink-300 tnum">{sub}</div>
    </div>
  );
}

/* ── CloudStack ──────────────────────────────────────────────── */
function CloudStack({ layers }: { layers: { coverage: string; base: number }[] }) {
  const max = 30000;
  const coverageWidth: Record<string, number> = { OVC: 1, BKN: 0.85, SCT: 0.55, FEW: 0.30 };
  const coverageColor: Record<string, string> = { OVC: '#5b6a8a', BKN: '#8492b3', SCT: '#b3bdd6', FEW: '#dde3ef' };

  return (
    <div className="relative h-32 flex items-end gap-2">
      <div className="h-full flex flex-col justify-between text-[10px] font-mono text-ink-500 tnum pr-2 border-r border-ink-700/40">
        <span>30k</span><span>20k</span><span>10k</span><span>SFC</span>
      </div>
      <div className="relative flex-1 h-full">
        {[0.33, 0.66].map((y, i) => (
          <div key={i} className="absolute left-0 right-0 border-t border-dashed border-ink-700/30" style={{ top: `${y * 100}%` }} />
        ))}
        {layers.map((L, i) => {
          const y = 100 - (L.base / max) * 100;
          const w = coverageWidth[L.coverage] ?? 0.4;
          const color = coverageColor[L.coverage] ?? '#8492b3';
          return (
            <div key={i} className="absolute left-0 right-0 flex items-center gap-3" style={{ top: `${y}%` }}>
              <div className="h-2 rounded-full" style={{ width: `${w * 65}%`, background: `linear-gradient(90deg, ${color}55, ${color})` }} />
              <span className="text-[11px] font-mono text-ink-300 tnum">
                {L.coverage} {String(Math.round(L.base / 100)).padStart(3, '0')}
                <span className="text-ink-500"> · {L.base.toLocaleString()} ft</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── MetarCard ───────────────────────────────────────────────── */
interface Props {
  metar: MetarResponse;
  translation?: string;
  compact?: boolean;
}

export default function MetarCard({ metar, translation, compact = false }: Props) {
  const [showRaw, setShowRaw] = useState(false);

  const windValue = metar.wdir != null ? `${pad3(metar.wdir)}°` : 'VRB';
  const windSub = metar.wspd != null
    ? `${metar.wspd}${metar.wgst ? ` G${metar.wgst}` : ''} kt`
    : 'N/A';
  const tempValue = metar.temp != null ? `${metar.temp}°` : 'N/A';
  const tempSub = metar.temp != null
    ? `Dew ${metar.dewp ?? '–'}°C · Spread ${metar.dewp != null ? (metar.temp - metar.dewp).toFixed(1) : '–'}°`
    : '–';
  const altim = altimDisplay(metar.altim);
  const glowMap: Record<string, string> = {
    VFR: 'shadow-glow-green', MVFR: 'shadow-glow-blue', IFR: 'shadow-glow-red', LIFR: '',
  };

  if (compact) {
    return (
      <Surface className="p-5">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-mono font-bold text-[28px] text-white">{metar.icaoId}</span>
          <FlightCategoryBadge category={metar.fltCat} size="sm" />
        </div>
        <p className="text-[12px] text-ink-400 -mt-2 mb-3">{metar.name}</p>
        <div className="grid grid-cols-2 gap-2.5">
          <MiniStat icon={Wind} label="Wind" value={`${windValue} ${windSub}`} />
          <MiniStat icon={Eye} label="Vis" value={visibDisplay(metar.visib)} />
          <MiniStat icon={Thermometer} label="Temp/Dew" value={`${metar.temp ?? '–'}/${metar.dewp ?? '–'}°C`} />
          <MiniStat icon={Gauge} label="Altim" value={altim?.primary ?? 'N/A'} />
        </div>
        {metar.clouds && metar.clouds.length > 0 && (
          <div className="mt-3 rounded-lg border border-ink-700/50 bg-ink-950/40 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1">Clouds</div>
            <div className="flex flex-wrap gap-2">
              {metar.clouds.map((c, i) => (
                <span key={i} className="font-mono text-[11.5px] tnum text-ink-200 px-1.5 py-0.5 rounded bg-ink-800/60 ring-1 ring-ink-700/60">
                  {c.coverage} {String(Math.round(c.base / 100)).padStart(3, '0')}
                </span>
              ))}
            </div>
          </div>
        )}
        <details className="mt-3 group">
          <summary className="list-none cursor-pointer text-[12px] text-ink-400 hover:text-ink-200 flex items-center gap-1.5 transition-colors">
            <ChevronDown className="w-3.5 h-3.5 group-open:rotate-0 -rotate-90 transition-transform" />
            Raw METAR
          </summary>
          <pre className="mt-2 p-3 rounded-lg border border-ink-700/60 bg-ink-950/60 text-[11.5px] font-mono text-ink-100 leading-relaxed whitespace-pre-wrap break-all">
            {metar.rawOb}
          </pre>
        </details>
      </Surface>
    );
  }

  return (
    <div className="space-y-5 animate-fadeUp">
      <Surface className={`p-7 ${glowMap[metar.fltCat] ?? ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[42px] font-bold text-white tracking-tight font-mono tnum">{metar.icaoId}</h2>
              <FlightCategoryBadge category={metar.fltCat} size="lg" withLabel />
            </div>
            <div className="mt-1 text-[14px] text-ink-300">{metar.name}</div>
          </div>
        </div>

        {/* Instrument grid */}
        <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <InstrumentTile
            icon={Wind}
            label="Wind"
            value={windValue}
            sub={windSub}
            extra={metar.wdir != null ? <WindRose dir={metar.wdir} /> : undefined}
          />
          <InstrumentTile
            icon={Eye}
            label="Visibility"
            value={visibDisplay(metar.visib).replace(' SM', '')}
            sub="statute miles"
          />
          <InstrumentTile
            icon={Thermometer}
            label="Temp / Dew"
            value={tempValue}
            sub={tempSub}
          />
          <InstrumentTile
            icon={Gauge}
            label="Altimeter"
            value={altim?.primary ?? 'N/A'}
            sub={altim?.secondary ?? '–'}
          />
        </div>

        {/* Cloud layers */}
        {metar.clouds && metar.clouds.length > 0 && (
          <div className="mt-5 rounded-xl border border-ink-700/50 bg-ink-900/40 p-4">
            <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-ink-400 mb-3">
              <Layers className="w-3.5 h-3.5" /> Cloud Layers
            </div>
            <CloudStack layers={metar.clouds} />
          </div>
        )}

        {/* Raw METAR */}
        <button
          onClick={() => setShowRaw(s => !s)}
          className="mt-5 flex items-center gap-1.5 text-[12px] text-ink-400 hover:text-ink-200 transition-colors"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRaw ? '' : '-rotate-90'}`} />
          Raw METAR
        </button>
        {showRaw && (
          <pre className="mt-2 p-4 rounded-lg border border-ink-700/60 bg-ink-950/60 text-[12.5px] font-mono text-ink-100 leading-relaxed whitespace-pre-wrap break-all">
            {metar.rawOb}
          </pre>
        )}
      </Surface>

      {/* AI summary */}
      {translation && (
        <Surface className="p-6">
          <div className="flex items-center gap-2.5 text-[11.5px] uppercase tracking-[0.22em] text-accent mb-3">
            <Sparkles className="w-4 h-4" />
            AI Plain-English Summary
          </div>
          <p className="text-[14.5px] leading-relaxed text-ink-100 max-w-3xl">{translation}</p>
        </Surface>
      )}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-700/40 bg-ink-900/40 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-400">
        <Icon className="w-3 h-3 text-accent/80" /> {label}
      </div>
      <div className="mt-1 text-[13.5px] font-mono tnum text-white">{value}</div>
    </div>
  );
}
