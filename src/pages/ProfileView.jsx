import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { doc, getDoc } from 'firebase/firestore'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { db } from '../firebase'
import { setPublicError, setPublicProfile, setPublicStatus } from '../store/profilesSlice'
import { PortfolioProfile } from '../components/PortfolioProfile.jsx'

export function ProfileView() {
  const { uid } = useParams()
  const dispatch = useDispatch()
  const { publicProfile, publicStatus } = useSelector((s) => s.profiles)

  useEffect(() => {
    let mounted = true
    async function load() {
      dispatch(setPublicStatus('loading'))
      dispatch(setPublicError(''))
      try {
        const snap = await getDoc(doc(db, 'profiles', uid))
        if (!mounted) return
        if (!snap.exists()) {
          dispatch(setPublicProfile(null))
          dispatch(setPublicStatus('not_found'))
          return
        }
        dispatch(setPublicProfile({ uid: snap.id, ...snap.data() }))
        dispatch(setPublicStatus('succeeded'))
      } catch (e) {
        if (!mounted) return
        dispatch(setPublicStatus('failed'))
        dispatch(setPublicError(e?.message || 'Failed to load profile'))
        toast.error(e?.message || 'Failed to load profile')
      }
    }
    if (uid) load()
    return () => {
      mounted = false
    }
  }, [dispatch, uid])

  if (publicStatus === 'loading') {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        Loading…
      </div>
    )
  }

  if (publicStatus === 'not_found' || !publicProfile) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Profile not found.
        </div>
        <Link
          to="/people"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Back to People
        </Link>
      </div>
    )
  }

  const p = publicProfile

  return (
    <div className="space-y-8">
      <PortfolioProfile profile={p} />
      <Link
        to="/people"
        className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
      >
        Back to People
      </Link>
    </div>
  )
}

