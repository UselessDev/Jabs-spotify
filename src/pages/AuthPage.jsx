import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [waitingVerificationOpen, setWaitingVerificationOpen] = useState(false)
  const [verificationSuccessOpen, setVerificationSuccessOpen] = useState(false)

  useEffect(() => {
    // Supabase email verification often comes back with tokens in hash fragment.
    // We consume this state to avoid being stuck on signup mode after verification.
    const hash = window.location.hash
    if (!hash.includes('access_token')) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVerificationSuccessOpen(true)
    setIsSignup(false)
    window.history.replaceState({}, document.title, window.location.pathname)
    const timer = setTimeout(async () => {
      setVerificationSuccessOpen(false)
      await supabase.auth.signOut()
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const authMethod = isSignup
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password })
    const { data, error: authError } = await authMethod
    if (authError) setError(authError.message)
    if (isSignup && !authError) {
      const needsEmailVerification = !data.session
      if (needsEmailVerification) {
        setWaitingVerificationOpen(true)
      }
      // If email confirmation is disabled, user is instantly created.
      if (!needsEmailVerification) {
        setVerificationSuccessOpen(true)
      }
      setIsSignup(false)
    }
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101317] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-white/10 bg-[#171b22] p-6"
      >
        <h1 className="mb-5 text-2xl font-semibold text-slate-100">
          {isSignup ? 'Create account' : 'Sign in'}
        </h1>
        <div className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-white/10 bg-[#0f1318] px-3 py-2 text-slate-100"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-white/10 bg-[#0f1318] px-3 py-2 text-slate-100"
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-900"
          >
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsSignup((prev) => !prev)}
          className="mt-4 text-sm text-slate-300 underline"
        >
          {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </form>
      <Modal
        open={waitingVerificationOpen}
        title="Waiting for Verification"
        message="Please verify your email address from the link we sent. You can sign in after verification."
        onClose={() => setWaitingVerificationOpen(false)}
        primaryAction={() => setWaitingVerificationOpen(false)}
      />
      <Modal
        open={verificationSuccessOpen}
        title="Verification Successful"
        message="Your account is verified. Redirecting you to login..."
        primaryAction={null}
      />
    </main>
  )
}
