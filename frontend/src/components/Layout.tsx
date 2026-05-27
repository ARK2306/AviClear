import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Cloud, FileText, ClipboardList, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const NAV_ITEMS = [
  { to: '/metar',    label: 'METAR',    icon: Cloud },
  { to: '/notams',   label: 'NOTAMs',   icon: FileText },
  { to: '/briefing', label: 'Briefing', icon: ClipboardList },
];

function formatUTC(d: Date): string {
  return d.toISOString().slice(11, 19);
}

function RoleBadge({ role }: { role: string }) {
  const display = role.replace('ROLE_', '');
  return (
    <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-px rounded-sm text-[9.5px] font-semibold tracking-[0.16em] uppercase border border-accent/35 text-accent bg-accent/10">
      <span className="w-1 h-1 rounded-full bg-accent" />
      {display}
    </span>
  );
}

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [utc, setUtc] = useState(() => formatUTC(new Date()));

  useEffect(() => {
    const t = setInterval(() => setUtc(formatUTC(new Date())), 1000);
    return () => clearInterval(t);
  }, []);

  function handleSignOut() {
    signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-950">
      {/* ── NavBar ──────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 border-b border-ink-700/50 backdrop-blur"
        style={{ background: 'linear-gradient(to bottom, rgba(7,11,24,.92), rgba(7,11,24,.78))' }}
      >
        {/* Hairline accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center gap-6">
          {/* Brand */}
          <NavLink to="/metar" className="flex items-center gap-3 group">
            <Logo size={36} />
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-[19px] tracking-tight text-white">AviClear</span>
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.18em] text-ink-400 whitespace-nowrap">
                Preflight Ops
              </span>
            </div>
          </NavLink>

          {/* Nav pills */}
          <nav className="ml-2 flex items-center gap-1 p-1 rounded-xl border border-ink-700/60 bg-ink-900/60">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'relative px-3.5 h-9 rounded-lg text-[13px] font-medium flex items-center gap-2 transition-colors',
                    isActive
                      ? 'text-white bg-accent/15'
                      : 'text-ink-300 hover:text-white hover:bg-ink-800/60'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute inset-0 rounded-lg ring-1 ring-accent/40 pointer-events-none" />
                    )}
                    <Icon className="w-[15px] h-[15px]" />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-5">
            {/* Live UTC pill */}
            <div className="hidden md:flex items-center gap-2.5 px-3 h-9 rounded-lg border border-ink-700/60 bg-ink-900/60">
              <span className="relative flex">
                <span className="w-1.5 h-1.5 rounded-full bg-flight-vfr animate-pulse-dot" />
                <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-flight-vfr/40 animate-ping" />
              </span>
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-ink-300">Live</span>
              <span className="font-mono text-[12px] text-ink-100 tnum">{utc}</span>
              <span className="text-[10px] text-ink-400">UTC</span>
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-[13px] text-white font-medium">{user.username}</span>
                  <RoleBadge role={user.role} />
                </div>
              )}
              {user && (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ink-700 to-ink-800 ring-1 ring-ink-600 flex items-center justify-center text-[12px] font-semibold text-ink-100">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-[13px] text-ink-300 hover:text-white hover:bg-ink-800/60 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────────── */}
      <main className="flex-1 grid-bg">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <Outlet />
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-ink-700/40 py-6">
        <div className="mx-auto max-w-[1400px] px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-ink-400">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span>
              <span className="text-ink-200 font-semibold">AviClear</span> · AI-powered aviation preflight intelligence
            </span>
          </div>
          <span>For planning purposes only · Not a substitute for an official briefing</span>
        </div>
      </footer>
    </div>
  );
}
