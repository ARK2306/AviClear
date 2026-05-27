import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { register } from '../api/auth';
import Logo from '../components/Logo';
import Surface from '../components/Surface';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const ROLES = [
  { value: 'ROLE_PILOT',  label: 'Pilot' },
  { value: 'ROLE_VIEWER', label: 'Viewer' },
];

export default function Register() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_PILOT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(username, password, role);
      signIn(data.token, data.username, data.role);
      navigate('/metar');
    } catch {
      setError('Registration failed. The username may already be taken.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid-bg relative overflow-hidden">
      {/* Airframe compass backdrop */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <svg viewBox="0 0 600 600" className="w-[900px] h-[900px]" fill="none" stroke="#3b82f6" strokeWidth="0.5">
          <circle cx="300" cy="300" r="280" /><circle cx="300" cy="300" r="220" />
          <circle cx="300" cy="300" r="160" /><circle cx="300" cy="300" r="100" />
          <line x1="20" y1="300" x2="580" y2="300" /><line x1="300" y1="20" x2="300" y2="580" />
          <text x="305" y="36" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono">N</text>
          <text x="305" y="578" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono">S</text>
          <text x="30" y="305" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono">W</text>
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

      <div className="relative flex items-center justify-center px-6 py-16 min-h-[calc(100vh-2.5rem)]">
        <div className="w-full max-w-[440px] animate-fadeUp">
          {/* Brand */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <Logo size={64} />
              <div className="absolute inset-0 rounded-[18px] bg-accent/30 blur-2xl -z-10 scale-150" />
            </div>
            <h1 className="mt-5 font-display text-[34px] font-bold text-white tracking-tight">Create Account</h1>
            <p className="mt-1 text-[13.5px] text-ink-300">Get access to AI-powered preflight briefings</p>
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
                <span className="text-[11.5px] uppercase tracking-[0.16em] text-ink-300 font-semibold block mb-1.5">
                  Password
                </span>
                <input
                  className="field w-full h-11 px-3.5 rounded-lg text-[14px]"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </label>

              <div>
                <span className="text-[11.5px] uppercase tracking-[0.16em] text-ink-300 font-semibold block mb-1.5">
                  Role
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(r => (
                    <label key={r.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={role === r.value}
                        onChange={() => setRole(r.value)}
                        className="peer sr-only"
                      />
                      <div className="h-10 rounded-lg border border-ink-700/60 bg-ink-900/40 flex items-center justify-center text-[13px] text-ink-300 peer-checked:border-accent/60 peer-checked:bg-accent/10 peer-checked:text-white transition-colors cursor-pointer">
                        {r.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" loading={loading} className="mt-2 w-full" size="lg" icon={ArrowRight}>
                Create Account
              </Button>

              <div className="relative my-1">
                <div className="border-t border-ink-700/50" />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-ink-800 text-[10.5px] uppercase tracking-[0.2em] text-ink-400">
                  or
                </span>
              </div>

              <p className="text-center text-[13px] text-ink-300">
                Have an account?{' '}
                <Link to="/login" className="text-accent font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </Surface>

          <p className="mt-6 text-center text-[11px] text-ink-500">
            By creating an account you agree this is for flight planning purposes only.
          </p>
        </div>
      </div>
    </main>
  );
}
