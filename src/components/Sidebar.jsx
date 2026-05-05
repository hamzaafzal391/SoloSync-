import { FileText, Home, LayoutDashboard, Mail, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/#about', label: 'About', icon: User },
  { to: '/#contact', label: 'Contact', icon: Mail },
  { to: '/#blog', label: 'Blog', icon: FileText },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
      />
      <aside
        className={[
          'fixed left-0 top-0 z-50 h-dvh w-72 border-r border-zinc-200 bg-white p-4 transition-transform dark:border-zinc-800 dark:bg-zinc-950 md:sticky md:z-0 md:h-[calc(100dvh-3.5rem)] md:translate-x-0 md:border-r md:top-14',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        aria-label="Sidebar"
      >
        <div className="flex items-center gap-2 pb-4 md:hidden">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Menu
          </span>
        </div>

        <nav className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <Link
                key={it.label}
                to={it.to}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                <Icon className="h-4 w-4" />
                <span>{it.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
          Simple responsive layout with Tailwind.
        </div>
      </aside>
    </>
  )
}
