import clsx from 'clsx';
import type { ButtonHTMLAttributes, ElementType } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ElementType;
}

const SIZES = {
  sm: 'h-8 px-3 text-[12.5px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
};

const VARIANTS = {
  primary:   'bg-accent hover:bg-blue-500 text-white shadow-glow-blue',
  secondary: 'bg-ink-800/80 hover:bg-ink-700/80 border border-ink-600/60 text-ink-100',
  ghost:     'text-ink-200 hover:text-white hover:bg-ink-800/60',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon: Icon,
  children,
  className = '',
  disabled,
  ...rest
}: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed',
        SIZES[size],
        VARIANTS[variant],
        className
      )}
      disabled={loading || disabled}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );
}
