import { signOut } from 'firebase/auth'
import { Menu } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'

export function Navbar({ onMenuClick }) {
  const user = useSelector((s) => s.auth.user)

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4">
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
            SoloSync
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <div className="hidden items-center gap-1 md:flex">
            <Link
              to="/people"
              className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              People
            </Link>
            {user ? (
              <>
                <Link
                  to="/me"
                  className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  My profile
                </Link>
                <Link
                  to="/dashboard"
                  className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Dashboard
                </Link>
              </>
            ) : null}
          </div>

          {user ? (
            <button
              type="button"
              onClick={() => signOut(auth)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 sm:text-sm"
            >
              Sign out
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                to="/login"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 sm:text-sm"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 sm:text-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
