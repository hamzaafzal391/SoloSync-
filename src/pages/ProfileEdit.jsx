import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import { db } from '../firebase'
import { setMyError, setMyProfile, setMyStatus } from '../store/profilesSlice'

function cleanUrl(s) {
  const v = String(s || '').trim()
  if (!v) return ''
  if (v.startsWith('http://') || v.startsWith('https://')) return v
  return `https://${v}`
}

function emptyProject() {
  return { title: '', description: '', link: '', imageUrl: '', tags: '' }
}

export function ProfileEdit() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const { myStatus } = useSelector((s) => s.profiles)

  const [badgeText, setBadgeText] = useState('')
  const [headline, setHeadline] = useState('')
  const [intro, setIntro] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [about1, setAbout1] = useState('')
  const [about2, setAbout2] = useState('')
  const [focusTitle, setFocusTitle] = useState('')
  const [focusDesc, setFocusDesc] = useState('')
  const [styleTitle, setStyleTitle] = useState('')
  const [styleDesc, setStyleDesc] = useState('')
  const [email, setEmail] = useState('')
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [projects, setProjects] = useState([emptyProject(), emptyProject()])
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
          setEmail(user.email || '')
          return
        }
        const data = snap.data() || {}
        dispatch(setMyProfile({ uid: snap.id, ...data }))
        dispatch(setMyStatus('succeeded'))
        setBadgeText(data.badgeText || '')
        setHeadline(data.headline || '')
        setIntro(data.intro || '')
        setHeroImageUrl(data.heroImageUrl || '')
        setDisplayName(data.displayName || '')
        setBio(data.bio || '')
        setAbout1(data.about1 || '')
        setAbout2(data.about2 || '')
        setFocusTitle(data.focusTitle || '')
        setFocusDesc(data.focusDesc || '')
        setStyleTitle(data.styleTitle || '')
        setStyleDesc(data.styleDesc || '')
        setEmail(data?.links?.email || user.email || '')
        setGithub(data?.links?.github || '')
        setLinkedin(data?.links?.linkedin || '')
        setInstagram(data?.links?.instagram || '')
        const list = Array.isArray(data.projects) ? data.projects : []
        const normalized = list.slice(0, 6).map((p) => ({
          title: p.title || '',
          description: p.description || '',
          link: p.link || '',
          imageUrl: p.imageUrl || '',
          tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
        }))
        setProjects(
          normalized.length ? normalized : [emptyProject(), emptyProject()],
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
  }, [dispatch, user?.uid, user?.email])

  const canSave = useMemo(() => {
    return Boolean(user?.uid) && Boolean(displayName.trim())
  }, [user?.uid, displayName])

  function setProject(idx, patch) {
    setProjects((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    )
  }

  function addProject() {
    setProjects((prev) => [...prev, emptyProject()].slice(0, 6))
  }

  function removeProject(idx) {
    setProjects((prev) => prev.filter((_, i) => i !== idx))
  }

  async function save() {
    if (!canSave) {
      toast.error('Display name is required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        badgeText: badgeText.trim(),
        headline: headline.trim(),
        intro: intro.trim(),
        heroImageUrl: cleanUrl(heroImageUrl),
        displayName: displayName.trim(),
        bio: bio.trim(),
        about1: about1.trim(),
        about2: about2.trim(),
        focusTitle: focusTitle.trim(),
        focusDesc: focusDesc.trim(),
        styleTitle: styleTitle.trim(),
        styleDesc: styleDesc.trim(),
        links: {
          email: String(email || '').trim(),
          github: cleanUrl(github),
          linkedin: cleanUrl(linkedin),
          instagram: cleanUrl(instagram),
        },
        projects: projects
          .map((p) => ({
            title: String(p.title || '').trim(),
            description: String(p.description || '').trim(),
            link: cleanUrl(p.link),
            imageUrl: cleanUrl(p.imageUrl),
            tags: String(p.tags || '')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
              .slice(0, 8),
          }))
          .filter((p) => p.title || p.description || p.link || p.imageUrl || p.tags.length),
        updatedAt: serverTimestamp(),
      }
      await setDoc(doc(db, 'profiles', user.uid), payload, { merge: true })
      toast.success('Profile saved')
      dispatch(setMyStatus('succeeded'))
    } catch (e) {
      toast.error(e?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My profile</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Update your public profile. Guests can view it on the People page.
        </p>
        {myStatus === 'loading' ? (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Loading…
          </p>
        ) : null}
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold tracking-tight">Portfolio header</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Badge text
            <input
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="Portfolio, Available, Open to work..."
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Headline
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Your name — role — what you build"
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
        </div>
        <label className="mt-4 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Intro
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <label className="mt-4 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Hero image URL
          <input
            value={heroImageUrl}
            onChange={(e) => setHeroImageUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            About paragraph 1
            <textarea
              value={about1}
              onChange={(e) => setAbout1(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            About paragraph 2
            <textarea
              value={about2}
              onChange={(e) => setAbout2(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Focus title
            <input
              value={focusTitle}
              onChange={(e) => setFocusTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Style title
            <input
              value={styleTitle}
              onChange={(e) => setStyleTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Focus description
            <textarea
              value={focusDesc}
              onChange={(e) => setFocusDesc(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Style description
            <textarea
              value={styleDesc}
              onChange={(e) => setStyleDesc(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Display name
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
        </div>
        <label className="mt-4 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            GitHub URL
            <input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            LinkedIn URL
            <input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Instagram URL
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Add up to 6 projects.
            </p>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Add project
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Project {idx + 1}
                </p>
                {projects.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Title
                  <input
                    value={p.title}
                    onChange={(e) => setProject(idx, { title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                </label>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                  <textarea
                    value={p.description}
                    onChange={(e) =>
                      setProject(idx, { description: e.target.value })
                    }
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                </label>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Link
                  <input
                    value={p.link}
                    onChange={(e) => setProject(idx, { link: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                </label>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Image URL
                  <input
                    value={p.imageUrl}
                    onChange={(e) =>
                      setProject(idx, { imageUrl: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                </label>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Tags (comma separated)
                  <input
                    value={p.tags}
                    onChange={(e) => setProject(idx, { tags: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </section>
    </div>
  )
}

