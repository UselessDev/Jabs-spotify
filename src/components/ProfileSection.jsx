import { useState } from 'react'
import Modal from './Modal'
import { supabase } from '../lib/supabase'

export default function ProfileSection({ user }) {
  const [password, setPassword] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [error, setError] = useState('')

  const handleUpdatePassword = async () => {
    setError('')
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      return
    }
    setPassword('')
    setSuccessOpen(true)
  }

  return (
    <section className="space-y-4 rounded-xl border border-white/10 bg-[#171b22] p-5">
      <h2 className="text-lg font-semibold text-slate-100">Profile</h2>
      <div className="space-y-1 text-sm text-slate-300">
        <p>
          <span className="text-slate-400">Email:</span> {user?.email}
        </p>

      </div>
      <div className="max-w-sm space-y-2">
        <label className="text-sm text-slate-300">
          Change password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1318] px-3 py-2 text-slate-100"
          />
        </label>
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button
          type="button"
          disabled={!password}
          onClick={handleUpdatePassword}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50"
        >
          Update Password
        </button>
      </div>
      <Modal
        open={successOpen}
        title="Profile updated"
        message="Your password has been changed successfully."
        onClose={() => setSuccessOpen(false)}
        primaryAction={() => setSuccessOpen(false)}
      />
    </section>
  )
}
