import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { auth, db } from '../firebase'
import { setAuthReady, setAuthUser } from '../store/authSlice'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import aiDoctorImg from '../assets/projects/ai-doctor.svg'
import legalAssistantImg from '../assets/projects/legal-assistant.svg'
import fintechLedgerImg from '../assets/projects/fintech-ledger.svg'
import smartDashboardImg from '../assets/projects/smart-dashboard.svg'
import hamzaImg from '../assets/hamza.jpg'

function mapUser(user) {
  if (!user) return null
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }
}

export function AuthInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch(setAuthUser(mapUser(user)))
      dispatch(setAuthReady(true))
      const email = user?.email || ''
      if (email === 'hamzacreed98@gmail.com' && user?.uid) {
        ;(async () => {
          const ref = doc(db, 'profiles', user.uid)
          const snap = await getDoc(ref)
          if (snap.exists()) return
          await setDoc(
            ref,
            {
              displayName: 'Hamza Afzal',
              badgeText: 'Portfolio starter',
              headline: 'Hamza Afzal — 22 — building modern web + AI products.',
              intro:
                'I build clean interfaces, ship fast, and focus on making complex ideas feel simple. I enjoy dashboards, automation, and AI-powered tools that solve real problems.',
              heroImageUrl: hamzaImg,
              about1:
                'I’m Hamza Afzal, 22 years old. I like building products that feel fast and friendly—especially dashboards, AI assistants, and tools that help people make better decisions.',
              about2:
                'I care about clean UI, readable code, and practical features: search, analytics, export, and smooth onboarding.',
              focusTitle: 'React + Firebase',
              focusDesc: 'Auth, Firestore, realtime CRUD, and clean state flows.',
              styleTitle: 'Friendly UX',
              styleDesc:
                'Clear layouts, quick feedback, and details that feel premium.',
              links: {
                email: 'hamzacreed98@gmail.com',
                github: 'https://github.com/hamzaafzal391',
                linkedin:
                  'https://www.linkedin.com/in/hamza-afzal-57b723340/',
                instagram: 'https://www.instagram.com/hamzaafzal781/',
              },
              projects: [
                {
                  title: 'AI Doctor',
                  imageUrl: aiDoctorImg,
                  tags: ['NLP', 'Triage', 'Summaries'],
                  description:
                    'A healthcare assistant that turns symptoms into a structured summary, suggests next steps, and helps users ask better questions.',
                },
                {
                  title: 'Legal Assistant',
                  imageUrl: legalAssistantImg,
                  tags: ['Contracts', 'Extraction', 'Risk'],
                  description:
                    'A document helper that highlights risky clauses, extracts key terms, and generates quick, human-readable summaries for review.',
                },
                {
                  title: 'Fintech Ledger',
                  imageUrl: fintechLedgerImg,
                  tags: ['Firebase', 'Redux', 'PDF'],
                  description:
                    'A friendly finance tracker with realtime transactions, search, analytics, and one-click statement export.',
                },
                {
                  title: 'Smart Analytics Dashboard',
                  imageUrl: smartDashboardImg,
                  tags: ['Charts', 'Insights', 'UX'],
                  description:
                    'A modern dashboard that visualizes patterns, highlights anomalies, and focuses on clarity and speed across devices.',
                },
              ],
              blogPosts: [
                {
                  title: 'Building a clean finance dashboard',
                  date: '2026-05-05',
                  excerpt:
                    'How I designed a simple ledger workflow: fast CRUD, quick search, and readable statements.',
                },
                {
                  title: 'What I learned shipping AI features',
                  date: '2026-04-22',
                  excerpt:
                    'Practical notes on prompts, guardrails, and UI patterns that make AI useful instead of noisy.',
                },
                {
                  title: 'From idea to MVP in one weekend',
                  date: '2026-03-30',
                  excerpt:
                    'A repeatable approach to scoping, building, and polishing a project without overengineering.',
                },
              ],
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          )
        })()
      }
    })
    return () => unsub()
  }, [dispatch])

  return null
}
