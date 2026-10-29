"use client";

import { useState } from "react";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  tone?: "primary" | "muted" | "danger";
};

function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7.5h16M4 12h16M4 16.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19c1.5-2.7 4.2-4 7-4s5.5 1.3 7 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HistoryIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4 5v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7.5v4l3 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.8v2.3M12 17.9v2.3M4.6 12H2.3M21.7 12h-2.3M6.7 6.7l-1.6-1.6M18.9 18.9l-1.6-1.6M17.3 6.7l1.6-1.6M5.1 18.9l1.6-1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function HelpIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.8 9.5a2.4 2.4 0 1 1 4.4 1.4c-.9 1.1-2.2 1.5-2.2 3.2M12 17.2h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M10 17v2.5A1.5 1.5 0 0 0 11.5 21h6A1.5 1.5 0 0 0 19 19.5v-15A1.5 1.5 0 0 0 17.5 3h-6A1.5 1.5 0 0 0 10 4.5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 12h-9M8 8.5 4.5 12 8 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SidebarNav() {
  const [open, setOpen] = useState(false);

  const items: NavItem[] = [
    { label: "Account", icon: <UserIcon className="h-5 w-5" />, tone: "primary" },
    { label: "Recent translations", icon: <HistoryIcon className="h-5 w-5" />, tone: "muted" },
    { label: "Settings", icon: <SettingsIcon className="h-5 w-5" />, tone: "muted" },
    { label: "Help & support", icon: <HelpIcon className="h-5 w-5" />, tone: "muted" },
    { label: "Log out", icon: <LogoutIcon className="h-5 w-5" />, tone: "danger" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Open navigation menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.6)] backdrop-blur-sm transition hover:scale-[1.02]"
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      <div
        className={`fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col border-r border-white/40 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(17,24,39,0.9))] p-4 text-white shadow-[0_30px_80px_rgba(15,23,42,0.5)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-900/30">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Profile
              </p>
              <h3 className="text-lg font-bold">Amina M.</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-6 space-y-2">
          {items.map(({ label, icon, tone }) => {
            const toneStyles = {
              primary: "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/20",
              muted: "bg-white/3 text-slate-200 hover:bg-white/6",
              danger: "bg-rose-500/10 text-rose-200 hover:bg-rose-500/15",
            };

            return (
              <button
                key={label}
                type="button"
                onClick={() => setOpen(false)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-base font-medium transition ${toneStyles[tone ?? "muted"]}`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-current">
                    {icon}
                  </span>
                  {label}
                </span>
                <span className="text-xs text-slate-300">→</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[26px] bg-gradient-to-br from-emerald-500/15 to-cyan-400/10 p-4 ring-1 ring-emerald-300/20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Quick status
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Translation is ready for live conversations and caption review.
          </p>
        </div>
      </aside>
    </>
  );
}
