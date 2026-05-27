import { AlertTriangle } from 'lucide-react';

interface Props {
  message: string;
  title?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, title = 'Request failed', onRetry }: Props) {
  return (
    <div className="rounded-2xl border border-sev-critical/30 bg-sev-critical/[0.04] p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-sev-critical/15 ring-1 ring-sev-critical/40 flex items-center justify-center text-sev-critical flex-shrink-0">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-[14px] font-semibold text-white">{title}</div>
        <p className="text-[13px] text-ink-300 mt-0.5">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-3 text-[12.5px] text-accent hover:underline">
            Try again →
          </button>
        )}
      </div>
    </div>
  );
}
