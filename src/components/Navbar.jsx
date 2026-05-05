import { Menu } from 'lucide-react'

export function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            WebProjFinal
          </span>
        </div>
        <div className="ml-auto hidden items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
          <a
            href="#contact"
            className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Contact
          </a>
          <a
            href="#blog"
            className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Blog
          </a>
        </div>
      </div>
    </header>
  )
}
