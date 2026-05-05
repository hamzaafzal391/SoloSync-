import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './Navbar.jsx'
import { Sidebar } from './Sidebar.jsx'
import { Footer } from './Footer.jsx'

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
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-[calc(100dvh-3.5rem)] w-full flex-col">
        <main className="flex-1 px-4 py-8 md:px-10">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
