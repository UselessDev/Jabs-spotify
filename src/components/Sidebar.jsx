import { Heart, Home, Library, UserCircle2 } from 'lucide-react'

export default function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'library', label: 'Library', icon: Library },
    { key: 'favorites', label: 'Favorites', icon: Heart },
    { key: 'profile', label: 'Profile', icon: UserCircle2 },
  ]

  return (
    <aside className="w-full rounded-xl border border-white/10 bg-[#171b22] p-4 md:w-64">
      <h1 className="mb-5 text-xl font-semibold text-slate-100">Jabs Spotify</h1>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = activeSection === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveSection(item.key)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-slate-300 transition hover:text-slate-100"
            >
              <Icon
                size={18}
                className={active ? 'text-emerald-300' : 'text-slate-400'}
              />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
