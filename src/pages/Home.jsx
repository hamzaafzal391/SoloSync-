import heroImg from '../assets/hero.png'
import { ExternalLink, Mail, MapPin, MessageCircle, Share2 } from 'lucide-react'

const posts = [
  { title: 'First post', date: '2026-01-12' },
  { title: 'A small update', date: '2026-02-03' },
  { title: 'What I’m building next', date: '2026-03-18' },
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
            Hi, I’m Hamza. I build simple, modern web apps.
          </h1>
          <p id="about" className="text-pretty text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            This is a clean starting layout: a responsive navbar, a sidebar, and a
            home page with hero, contact, and blog sections. Swap the content
            anytime.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Contact me
            </a>
            <a
              href="#blog"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Read the blog
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
          <img
            src={heroImg}
            alt="Placeholder"
            className="h-64 w-full object-cover md:h-80"
          />
        </div>
      </section>

      <section
        id="contact"
        className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Reach out on social or send an email. Replace these links with your
            real profiles.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="mailto:hello@example.com"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <ExternalLink className="h-4 w-4" />
              Projects
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <MessageCircle className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Share2 className="h-4 w-4" />
              Social
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
            Dummy cards
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
                  A short excerpt goes here. Replace with real content later.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

