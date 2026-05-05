import aiDoctorImg from '../assets/projects/ai-doctor.svg'
import legalAssistantImg from '../assets/projects/legal-assistant.svg'
import fintechLedgerImg from '../assets/projects/fintech-ledger.svg'
import smartDashboardImg from '../assets/projects/smart-dashboard.svg'
import hamzaImg from '../assets/hamza.jpg'
import {
  Globe,
  Link,
  Mail,
  MapPin,
} from 'lucide-react'

const posts = [
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
]

const projects = [
  {
    title: 'AI Doctor',
    image: aiDoctorImg,
    tags: ['NLP', 'Triage', 'Summaries'],
    description:
      'A healthcare assistant that turns symptoms into a structured summary, suggests next steps, and helps users ask better questions.',
  },
  {
    title: 'Legal Assistant',
    image: legalAssistantImg,
    tags: ['Contracts', 'Extraction', 'Risk'],
    description:
      'A document helper that highlights risky clauses, extracts key terms, and generates quick, human-readable summaries for review.',
  },
  {
    title: 'Fintech Ledger',
    image: fintechLedgerImg,
    tags: ['Firebase', 'Redux', 'PDF'],
    description:
      'A friendly finance tracker with realtime transactions, search, analytics, and one-click statement export.',
  },
  {
    title: 'Smart Analytics Dashboard',
    image: smartDashboardImg,
    tags: ['Charts', 'Insights', 'UX'],
    description:
      'A modern dashboard that visualizes patterns, highlights anomalies, and focuses on clarity and speed across devices.',
  },
]

export function Home() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
            <MapPin className="h-4 w-4" />
            Portfolio starter
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Hamza Afzal — 22 — building modern web + AI products.
          </h1>
          <p className="text-pretty text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            I build clean interfaces, ship fast, and focus on making complex ideas feel simple.
            I enjoy dashboards, automation, and AI-powered tools that solve real problems.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Contact me
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              View projects
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
          <img
            src={hamzaImg}
            alt="Placeholder"
            className="h-64 w-full object-cover md:h-80"
          />
        </div>
      </section>

      <section
        id="about"
        className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2"
      >
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">About</h2>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            I’m Hamza Afzal, 22 years old. I like building products that feel fast and
            friendly—especially dashboards, AI assistants, and tools that help people make better
            decisions.
          </p>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            I care about clean UI, readable code, and practical features: search, analytics, export,
            and smooth onboarding.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Focus</p>
            <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              React + Firebase
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Auth, Firestore, realtime CRUD, and clean state flows.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Style</p>
            <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Friendly UX
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Clear layouts, quick feedback, and details that feel premium.
            </p>
          </div>
        </div>
      </section>

      <section id="projects" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            High-tech builds
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.title}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                <img src={p.image} alt={p.title} className="h-44 w-full object-cover" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold tracking-tight">{p.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {p.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Reach out on social or send an email.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="mailto:hamzacreed98@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a
              href="https://github.com/hamzaafzal391"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Link className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/hamza-afzal-57b723340/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Globe className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/hamzaafzal781/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Globe className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <iframe
            title="Map"
            src="https://www.google.com/maps?q=Casablanca&output=embed"
            className="h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section id="blog" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Blog</h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Notes from building
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/40"
            >
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {p.date}
                </p>
                <h3 className="text-sm font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {p.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

