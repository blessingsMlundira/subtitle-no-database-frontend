import Link from "next/link";

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2.5 14.2 8l5.3 2.2-5.3 2.2L12 18l-2.2-5.6L4.5 10.2 9.8 8 12 2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 4.5v2.7M19.8 6.2h-2.6M5 16l1.2 2.3L8.5 19l-2.3 1.2L5 22.5l-1.2-2.3L1.5 19l2.3-1.2L5 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="10" width="14" height="10.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7.7A4 4 0 0 1 12 4a4 4 0 0 1 4 3.7V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19.2c1.5-2.8 4.1-4.2 7-4.2s5.5 1.4 7 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 12h17M12 3.5c2.8 2.5 4.3 5.4 4.3 8.5S14.8 18 12 20.5C9.2 18 7.7 15.1 7.7 12S9.2 6 12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(134,239,172,0.35),_rgba(255,255,255,0)_24%),linear-gradient(135deg,#ecfdf5_0%,#f8fafc_35%,#eef2ff_100%)] px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:grid-cols-[1.03fr_1.2fr]">
          <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600 p-8 text-white sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.26),_rgba(255,255,255,0)_45%)]" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
                  <BrandMark className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-50/90">
                    Live language translation
                  </p>
                  <h1 className="mt-1 text-2xl font-black tracking-tight">Lankhula</h1>
                </div>
              </div>

              <div className="mt-12 max-w-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-50/80">
                  Welcome back
                </p>
                <h2 className="mt-3 text-4xl font-black leading-tight">
                  Translate live conversations with clarity.
                </h2>
                <p className="mt-4 text-base leading-7 text-emerald-50/85">
                  Capture spoken words, instantly translate them, and keep bilingual context in one place.
                </p>
              </div>

              <div className="mt-auto space-y-4 pt-10">
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <GlobeIcon className="h-5 w-5 text-emerald-100" />
                  <span className="text-sm text-emerald-50/90">Real-time speech and translation</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <BrandMark className="h-5 w-5 text-emerald-100" />
                  <span className="text-sm text-emerald-50/90">Clean captions for every conversation</span>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Access portal</p>
                <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Log in</h3>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Secure
              </div>
            </div>

            <form className="space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  Remember me
                </label>
                <Link href="#" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-3.5 text-base font-semibold text-white shadow-[0_18px_32px_-15px_rgba(16,185,129,0.8)] transition hover:translate-y-[-1px] hover:shadow-[0_20px_35px_-15px_rgba(16,185,129,0.95)]"
              >
                Sign in
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <UserIcon className="h-4 w-4" />
                Google
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <GlobeIcon className="h-4 w-4" />
                Web
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600">
              New here?{' '}
              <Link href="/signup" className="font-semibold text-emerald-700 transition hover:text-emerald-800">
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
