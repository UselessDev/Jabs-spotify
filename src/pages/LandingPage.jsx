import {
  CircleUserRound,
  Heart,
  ListMusic,
  Music2,
  PlayCircle,
  Upload,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Music Streaming',
    description: 'Play your uploaded songs instantly with a smooth bottom player.',
    icon: Music2,
  },
  {
    title: 'Smart Playlists',
    description: 'Create, manage, reorder, and play full playlists with one click.',
    icon: ListMusic,
  },
  {
    title: 'Favorites',
    description: 'Like songs and keep your top tracks in one dedicated section.',
    icon: Heart,
  },
  {
    title: 'User Profiles',
    description: 'Manage your account securely with user-specific library access.',
    icon: CircleUserRound,
  },
]

const steps = [
  {
    title: 'Create an account',
    description: 'Sign up with email and verify your account to unlock your library.',
  },
  {
    title: 'Upload your music',
    description: 'Add songs with title, artist, audio file, and custom cover art.',
  },
  {
    title: 'Organize and enjoy',
    description: 'Build playlists, like tracks, and stream music across your queue.',
  },
]

export default function LandingPage({ user }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1117] via-[#101317] to-[#0e1117] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#101317]/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold tracking-wide">Jabs Spotify</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-slate-200 transition hover:border-white/35"
            >
              Login
            </Link>
            <Link
              to={user ? '/app' : '/auth'}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-emerald-400"
            >
              {user ? 'Open App' : 'Get Started'}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-[landingFadeUp_450ms_ease-out]">
            <p className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              Personal Music Library
            </p>
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              Stream your own songs in a Spotify-style experience.
            </h2>
            <p className="mt-4 max-w-xl text-slate-300">
              Upload tracks, build playlists, save favorites, and play seamlessly with a
              modern, responsive music dashboard.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={user ? '/app' : '/auth'}
                className="rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-emerald-400"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Link>
              <Link
                to="/auth"
                className="rounded-xl border border-white/20 px-5 py-2.5 font-semibold text-slate-100 transition hover:border-white/40"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="animate-[landingFloat_4.5s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-[#171b22] p-5 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop"
              alt="Music setup"
              className="h-64 w-full rounded-xl object-cover"
            />
            <div className="mt-4 flex items-center justify-between rounded-lg bg-[#0f1318] p-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">Now Playing</p>
                <p className="text-xs text-slate-400">Your uploaded collection</p>
              </div>
              <PlayCircle className="text-emerald-300" size={28} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h3 className="mb-8 text-center text-2xl font-bold">Features</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <article
                  key={feature.title}
                  className="animate-[landingFadeUp_550ms_ease-out] rounded-xl border border-white/10 bg-[#171b22] p-4"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <Icon size={20} className="text-emerald-300" />
                  <h4 className="mt-3 font-semibold">{feature.title}</h4>
                  <p className="mt-1 text-sm text-slate-400">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h3 className="mb-8 text-center text-2xl font-bold">How It Works</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.title} className="rounded-xl border border-white/10 bg-[#171b22] p-5">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-sm font-semibold text-emerald-300">
                  {idx + 1}
                </div>
                <h4 className="font-semibold">{step.title}</h4>
                <p className="mt-1 text-sm text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 p-6 text-center md:p-10">
            <Upload className="mx-auto text-emerald-300" size={28} />
            <h3 className="mt-4 text-2xl font-bold">Ready to build your personal music space?</h3>
            <p className="mt-2 text-slate-300">
              Start uploading songs and enjoy your own streaming library today.
            </p>
            <Link
              to={user ? '/app' : '/auth'}
              className="mt-6 inline-block rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-emerald-400"
            >
              {user ? 'Open Mini Spotify' : 'Sign Up Now'}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} Mini Spotify</p>
          <div className="flex gap-4">
            <a href="#" className="transition hover:text-slate-200">
              About
            </a>
            <a href="#" className="transition hover:text-slate-200">
              Contact
            </a>
            <a href="#" className="transition hover:text-slate-200">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
