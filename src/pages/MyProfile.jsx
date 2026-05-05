import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { doc, getDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { db } from '../firebase'
import { PortfolioProfile } from '../components/PortfolioProfile.jsx'
import { setMyError, setMyProfile, setMyStatus } from '../store/profilesSlice'

export function MyProfile() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const { myProfile, myStatus } = useSelector((s) => s.profiles)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user?.uid) return
      dispatch(setMyStatus('loading'))
      dispatch(setMyError(''))
      try {
        const snap = await getDoc(doc(db, 'profiles', user.uid))
        if (!mounted) return
        if (!snap.exists()) {
          dispatch(setMyProfile(null))
          dispatch(setMyStatus('new'))
          return
        }
        dispatch(setMyProfile({ uid: snap.id, ...snap.data() }))
        dispatch(setMyStatus('succeeded'))
      } catch (e) {
        if (!mounted) return
        dispatch(setMyStatus('failed'))
        dispatch(setMyError(e?.message || 'Failed to load profile'))
        toast.error(e?.message || 'Failed to load profile')
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [dispatch, user?.uid])

  if (myStatus === 'loading') {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        Loading…
      </div>
    )
  }

  if (myStatus === 'new' || !myProfile) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          You don’t have a public profile yet.
        </div>
        <Link
          to="/me/edit"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Create profile
        </Link>
      </div>
    )
  }

  const p = myProfile

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My profile</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            This is what guests see on your public page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/me/edit"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Edit profile
          </Link>
          <Link
            to="/me/blog"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Edit blog
          </Link>
          <Link
            to={`/u/${p.uid}`}
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            View public link
          </Link>
        </div>
      </div>

      <PortfolioProfile profile={p} />
    </div>
  )
}

