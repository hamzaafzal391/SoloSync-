import { signOut } from 'firebase/auth'
import { Menu } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'

export function Navbar({ onMenuClick }) {
  const user = useSelector((s) => s.auth.user)

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
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            WebProjFinal
          </span>
        </Link>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-1 text-sm text-zinc-600 dark:text-zinc-300 sm:gap-2">
          <Link
            to="/#contact"
            className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Contact
          </Link>
          <Link
            to="/#projects"
            className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Projects
          </Link>
          <Link
            to="/#blog"
            className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Blog
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-zinc-900 px-3 py-2 font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
