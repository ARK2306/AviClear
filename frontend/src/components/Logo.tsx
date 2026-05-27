interface Props {
  size?: number;
  className?: string;
}

export default function Logo({ size = 36, className = '' }: Props) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-[10px] flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 60%, #1e3a8a 100%)',
        boxShadow: '0 0 0 1px rgba(255,255,255,.08) inset, 0 6px 20px -6px rgba(59,130,246,.6)',
      }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.8 19.2 16 11l3.5-3.5a2.121 2.121 0 1 0-3-3L13 8 4.8 6.2c-.5-.1-.9.2-.9.7v.3l3.4 4-2 .7-1.5-1L3 11l2 2 2 2 1.1-.8-1-1.5.7-2 4 3.4h.3c.5 0 .8-.4.7-.9z" />
      </svg>
      <span
        className="absolute inset-0 rounded-[10px]"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18)' }}
      />
    </div>
  );
}
