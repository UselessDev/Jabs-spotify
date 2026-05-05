import { useState } from 'react'

const initialForm = {
  title: '',
  artist: '',
  audioFile: null,
  coverFile: null,
}

export default function SongForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm)

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit(form)
    setForm(initialForm)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-[#171b22] p-4">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Upload Song</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          required
          placeholder="Song title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          className="rounded-lg border border-white/10 bg-[#0f1318] px-3 py-2 text-slate-100"
        />
        <input
          required
          placeholder="Artist"
          value={form.artist}
          onChange={(event) => setForm((prev) => ({ ...prev, artist: event.target.value }))}
          className="rounded-lg border border-white/10 bg-[#0f1318] px-3 py-2 text-slate-100"
        />
        <label className="text-sm text-slate-300">
          Audio File
          <input
            required
            type="file"
            accept="audio/*"
            onChange={(event) =>
              setForm((prev) => ({ ...prev, audioFile: event.target.files?.[0] ?? null }))
            }
            className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-emerald-500/30 file:px-2 file:py-1 file:text-emerald-200"
          />
        </label>
        <label className="text-sm text-slate-300">
          Cover Image
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setForm((prev) => ({ ...prev, coverFile: event.target.files?.[0] ?? null }))
            }
            className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-indigo-500/30 file:px-2 file:py-1 file:text-indigo-200"
          />
        </label>
      </div>
      <button
        disabled={isSubmitting}
        className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-900 disabled:opacity-60"
      >
        {isSubmitting ? 'Uploading...' : 'Add Song'}
      </button>
    </form>
  )
}
