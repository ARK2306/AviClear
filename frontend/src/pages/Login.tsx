import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import Logo from '../components/Logo';
import Surface from '../components/Surface';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      signIn(data.token, data.username, data.role);
      navigate('/metar');
    } catch {
      setError('Invalid credentials. Check your username and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid-bg relative overflow-hidden">
      {/* Airframe compass backdrop */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <svg viewBox="0 0 600 600" className="w-[900px] h-[900px]" fill="none" stroke="#3b82f6" strokeWidth="0.5">
          <circle cx="300" cy="300" r="280" />
          <circle cx="300" cy="300" r="220" />
          <circle cx="300" cy="300" r="160" />
          <circle cx="300" cy="300" r="100" />
          <line x1="20" y1="300" x2="580" y2="300" />
          <line x1="300" y1="20" x2="300" y2="580" />
          <text x="305" y="36" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono">N</text>
          <text x="305" y="578" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono">S</text>
          <text x="30"  y="305" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono">W</text>
          <text x="555" y="305" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono">E</text>
        </svg>
      </div>

      {/* Status strip */}
      <div className="relative border-b border-ink-700/40 bg-ink-950/40 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-6 h-10 flex items-center gap-4 text-[11px] font-mono tnum text-ink-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-flight-vfr animate-pulse-dot" />
            SYS NOMINAL
          </span>
          <span className="text-ink-600">·</span>
          <span>NWS · FAA · ADDS · AVWX</span>
          <span className="ml-auto">AVICLEAR // OPS v1.0.0</span>
        </div>
      </div>

      {/* Center card */}
      <div className="relative flex items-center justify-center px-6 py-16 min-h-[calc(100vh-2.5rem)]">
        <div className="w-full max-w-[440px] animate-fadeUp">
          {/* Brand */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <Logo size={64} />
              <div className="absolute inset-0 rounded-[18px] bg-accent/30 blur-2xl -z-10 scale-150" />
            </div>
            <h1 className="mt-5 font-display text-[34px] font-bold text-white tracking-tight">AviClear</h1>
            <p className="mt-1 text-[13.5px] text-ink-300">Sign in to your briefing account</p>
          </div>

          <Surface className="p-7 corners">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <ErrorMessage message={error} />}

              <label className="block">
                <span className="text-[11.5px] uppercase tracking-[0.16em] text-ink-300 font-semibold block mb-1.5">
                  Username
                </span>
                <input
                  className="field w-full h-11 px-3.5 rounded-lg text-[14px]"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="pilot_callsign"
                  autoFocus
                  required
                />
              </label>

              <label className="block">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[11.5px] uppercase tracking-[0.16em] text-ink-300 font-semibold">Password</span>
                </div>
                <input
                  className="field w-full h-11 px-3.5 rounded-lg text-[14px]"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </label>

              <Button type="submit" loading={loading} className="mt-2 w-full" size="lg" icon={ArrowRight}>
                Sign In
              </Button>

              <p className="text-center text-[13px] text-ink-300">
                No account?{' '}
                <Link to="/register" className="text-accent font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </Surface>

          <p className="mt-6 text-center text-[11px] text-ink-500">
            By signing in you agree this is for flight planning purposes only and not a substitute for an official briefing.
          </p>
        </div>
      </div>
    </main>
  );
}
