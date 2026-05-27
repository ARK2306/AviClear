import clsx from 'clsx';

type Cat = 'VFR' | 'MVFR' | 'IFR' | 'LIFR';

const CONFIG: Record<Cat, { bg: string; ring: string; text: string; label: string }> = {
  VFR:  { bg: 'bg-flight-vfr/10',  ring: 'ring-flight-vfr/40',  text: 'text-flight-vfr',  label: 'Visual'       },
  MVFR: { bg: 'bg-flight-mvfr/10', ring: 'ring-flight-mvfr/40', text: 'text-flight-mvfr', label: 'Marginal VFR' },
  IFR:  { bg: 'bg-flight-ifr/10',  ring: 'ring-flight-ifr/40',  text: 'text-flight-ifr',  label: 'Instrument'   },
  LIFR: { bg: 'bg-flight-lifr/10', ring: 'ring-flight-lifr/40', text: 'text-flight-lifr', label: 'Low IFR'      },
};

const SIZES = {
  sm: 'px-2 py-0.5 text-[10.5px]',
  md: 'px-2.5 py-1 text-[12px]',
  lg: 'px-3.5 py-1.5 text-[14px]',
};

interface Props {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  withLabel?: boolean;
}

export default function FlightCategoryBadge({ category, size = 'md', withLabel = false }: Props) {
  const cfg = CONFIG[category as Cat] ?? {
    bg: 'bg-ink-700/40', ring: 'ring-ink-600/50', text: 'text-ink-300', label: category,
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md font-bold tracking-wider ring-1',
        cfg.bg, cfg.ring, cfg.text, SIZES[size]
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />
      {category}
      {withLabel && (
        <span className="ml-1 font-normal opacity-70 tracking-normal">· {cfg.label}</span>
      )}
    </span>
  );
}
