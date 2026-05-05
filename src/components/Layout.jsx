import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar.jsx'
import { Sidebar } from './Sidebar.jsx'

export function Layout() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar onMenuClick={() => setOpen(true)} />
      <div className="mx-auto flex max-w-6xl">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-8 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
