import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { db } from '../firebase'
import { setMyError, setMyProfile, setMyStatus } from '../store/profilesSlice'

function emptyPost() {
  return { title: '', date: '', excerpt: '' }
}

export function BlogEdit() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const { myStatus } = useSelector((s) => s.profiles)

  const [blogPosts, setBlogPosts] = useState([emptyPost(), emptyPost(), emptyPost()])
  const [saving, setSaving] = useState(false)

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
        const data = snap.data() || {}
        dispatch(setMyProfile({ uid: snap.id, ...data }))
        dispatch(setMyStatus('succeeded'))
        const postList = Array.isArray(data.blogPosts) ? data.blogPosts : []
        const normalizedPosts = postList.slice(0, 6).map((p) => ({
          title: p.title || '',
          date: p.date || '',
          excerpt: p.excerpt || '',
        }))
        setBlogPosts(
          normalizedPosts.length ? normalizedPosts : [emptyPost(), emptyPost(), emptyPost()],
        )
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

  const canSave = useMemo(() => Boolean(user?.uid), [user?.uid])

  function setPost(idx, patch) {
    setBlogPosts((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)))
  }

  function addPost() {
    setBlogPosts((prev) => [...prev, emptyPost()].slice(0, 6))
  }

  function removePost(idx) {
    setBlogPosts((prev) => prev.filter((_, i) => i !== idx))
  }

  async function save() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = {
        blogPosts: blogPosts
          .map((p) => ({
            title: String(p.title || '').trim(),
            date: String(p.date || '').trim(),
            excerpt: String(p.excerpt || '').trim(),
          }))
          .filter((p) => p.title || p.excerpt || p.date)
          .slice(0, 6),
        updatedAt: serverTimestamp(),
      }
      await setDoc(doc(db, 'profiles', user.uid), payload, { merge: true })
      toast.success('Blog saved')
      dispatch(setMyStatus('succeeded'))
    } catch (e) {
      toast.error(e?.message || 'Failed to save blog')
    } finally {
      setSaving(false)
    }
  }

  if (myStatus === 'loading') {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        Loading…
      </div>
    )
  }

  if (myStatus === 'new') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Create your profile first, then add blog posts.
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My blog</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Add posts that appear on your public profile.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? 'Saving…' : 'Save blog'}
          </button>
          <Link
            to="/me"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Blog posts</p>
          <button
            type="button"
            onClick={addPost}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Add post
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          {blogPosts.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start">
                <div className="flex-1 space-y-3">
                  <input
                    value={p.title}
                    onChange={(e) => setPost(idx, { title: e.target.value })}
                    placeholder="Post title"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                  <input
                    value={p.date}
                    onChange={(e) => setPost(idx, { date: e.target.value })}
                    placeholder="Date (e.g. 2026-05-05)"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                  <textarea
                    value={p.excerpt}
                    onChange={(e) => setPost(idx, { excerpt: e.target.value })}
                    placeholder="Short excerpt"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePost(idx)}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

