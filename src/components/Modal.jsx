import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  open,
  title,
  message,
  onClose,
  primaryAction,
  primaryLabel = 'OK',
  autoCloseMs = 3000,
}) {
  const width = 380
  const height = 132
  const borderRadius = 14
  const perimeter = 2 * (width + height - 2 * borderRadius) + 2 * Math.PI * borderRadius

  useEffect(() => {
    if (!open || !onClose || !autoCloseMs) return undefined
    const timer = setTimeout(() => onClose(), autoCloseMs)
    return () => clearTimeout(timer)
  }, [open, onClose, autoCloseMs])

  if (!open) return null

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 w-full max-w-sm">
      <div className="relative pointer-events-auto animate-[toastIn_220ms_ease-out] rounded-xl border border-white/15 bg-[#171b22]/95 p-4 shadow-xl backdrop-blur">
        {autoCloseMs ? (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <rect
              x="0.8"
              y="0.8"
              width={width - 1.6}
              height={height - 1.6}
              rx={borderRadius}
              ry={borderRadius}
              fill="none"
              stroke="rgba(52, 211, 153, 0.7)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray={perimeter}
              strokeDashoffset="0"
              style={{
                '--toast-perimeter': perimeter,
                animation: `toastBorderCountdown ${autoCloseMs}ms linear forwards`,
              }}
            />
          </svg>
        ) : null}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-slate-300">{message}</p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200"
              aria-label="Close popup"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {primaryAction && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={primaryAction}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-slate-900"
            >
              {primaryLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
