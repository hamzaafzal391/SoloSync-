import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { db } from '../firebase'
import { setPeople, setPeopleError, setPeopleStatus } from '../store/profilesSlice'

export function People() {
  const dispatch = useDispatch()
  const { people, peopleStatus } = useSelector((s) => s.profiles)
  const [q, setQ] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      dispatch(setPeopleStatus('loading'))
      dispatch(setPeopleError(''))
      try {
        const snap = await getDocs(query(collection(db, 'profiles'), orderBy('updatedAt', 'desc')))
        const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
        if (!mounted) return
        dispatch(setPeople(list))
        dispatch(setPeopleStatus('succeeded'))
      } catch (e) {
        if (!mounted) return
        dispatch(setPeopleStatus('failed'))
        dispatch(setPeopleError(e?.message || 'Failed to load people'))
        toast.error(e?.message || 'Failed to load people')
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [dispatch])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return people
    return people.filter((p) =>
      String(p.displayName || '').toLowerCase().includes(s),
    )
  }, [people, q])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">People</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Browse public profiles.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 sm:max-w-xs"
        />
      </div>

      {peopleStatus === 'loading' ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          No profiles found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.uid}
              to={`/u/${p.uid}`}
              className="flex min-h-[380px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/40"
            >
              <div className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                {p.heroImageUrl ? (
                  <img
                    src={p.heroImageUrl}
                    alt={p.displayName || 'Profile'}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-xs text-zinc-500 dark:text-zinc-400">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between gap-5 p-7">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {p.displayName || 'Unnamed'}
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      {p.headline || p.intro || p.bio || 'No overview yet.'}
                    </p>
                  </div>
                  <div className="shrink-0 space-y-2 text-right">
                    <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                      {Array.isArray(p.projects) ? p.projects.length : 0} projects
                    </span>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {Array.isArray(p.blogPosts) ? p.blogPosts.length : 0} posts
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {p.focusTitle ? (
                    <span className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                      {p.focusTitle}
                    </span>
                  ) : null}
                  {p.styleTitle ? (
                    <span className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                      {p.styleTitle}
                    </span>
                  ) : null}
                  {p.projectsLabel ? (
                    <span className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                      {p.projectsLabel}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

