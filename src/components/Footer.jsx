import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                SoloSync
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Publish a portfolio you’re proud of and track income vs debt in one clean app.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:col-span-2 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Explore</p>
              <div className="mt-3 grid gap-2 text-sm">
                <Link
                  to="/"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  Home
                </Link>
                <Link
                  to="/people"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  People
                </Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Account</p>
              <div className="mt-3 grid gap-2 text-sm">
                <Link
                  to="/me"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  My profile
                </Link>
                <Link
                  to="/dashboard"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  Dashboard
                </Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Get started</p>
              <div className="mt-3 grid gap-2 text-sm">
                <Link
                  to="/signup"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SoloSync. All rights reserved.</p>
          <p className="text-zinc-500 dark:text-zinc-400">Built with Tailwind + Firebase.</p>
        </div>
      </div>
    </footer>
  )
}

