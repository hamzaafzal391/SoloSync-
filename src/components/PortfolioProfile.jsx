import { Globe, Link, Mail, MapPin } from 'lucide-react'

export function PortfolioProfile({ profile }) {
  const p = profile || {}
  const links = p.links || {}
  const projects = Array.isArray(p.projects) ? p.projects : []
  const posts = Array.isArray(p.blogPosts) ? p.blogPosts : []

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
            <MapPin className="h-4 w-4" />
            {p.badgeText || 'Portfolio'}
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            {p.headline || p.displayName || 'Your name'}
          </h1>
          <p className="text-pretty text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {p.intro ||
              p.bio ||
              'Write a short introduction about what you build and what you’re focused on.'}
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
          {p.heroImageUrl ? (
            <img
              src={p.heroImageUrl}
              alt={p.displayName || 'Profile'}
              className="h-64 w-full object-cover md:h-80"
              loading="lazy"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400 md:h-80">
              Add a hero image URL in your profile.
            </div>
          )}
        </div>
      </section>

      <section
        id="about"
        className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2"
      >
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">About</h2>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {p.about1 || 'Add a short paragraph about who you are and what you do.'}
          </p>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {p.about2 || 'Add a second paragraph about your interests and strengths.'}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {p.focusLabel || 'Focus'}
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {p.focusTitle || 'Your focus'}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {p.focusDesc || 'What you’re building or learning right now.'}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {p.styleLabel || 'Style'}
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {p.styleTitle || 'Your style'}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {p.styleDesc || 'How you approach UX, code, and delivery.'}
            </p>
          </div>
        </div>
      </section>

      <section id="projects" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {p.projectsLabel || 'High-tech builds'}
          </span>
        </div>
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            No projects yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((pr, idx) => (
              <article
                key={`${idx}-${pr.title || 'project'}`}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              >
                {pr.imageUrl ? (
                  <div className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <img
                      src={pr.imageUrl}
                      alt={pr.title || 'Project'}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold tracking-tight">
                      {pr.title || 'Untitled'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(pr.tags)
                        ? pr.tags.slice(0, 6).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200"
                            >
                              {t}
                            </span>
                          ))
                        : null}
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {pr.description || ''}
                  </p>
                  {pr.link ? (
                    <a
                      href={pr.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      <Link className="h-4 w-4" />
                      Open project
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        id="contact"
        className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {p.contactBlurb || 'Reach out on social or send an email.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {links.email ? (
              <a
                href={`mailto:${links.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            ) : null}
            {links.github ? (
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <Link className="h-4 w-4" />
                GitHub
              </a>
            ) : null}
            {links.linkedin ? (
              <a
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <Globe className="h-4 w-4" />
                LinkedIn
              </a>
            ) : null}
            {links.instagram ? (
              <a
                href={links.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <Globe className="h-4 w-4" />
                Instagram
              </a>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <iframe
            title="Map"
            src={p.mapEmbedUrl || 'https://www.google.com/maps?q=Casablanca&output=embed'}
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
            {p.blogLabel || 'Notes'}
          </span>
        </div>
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            No posts yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {posts.slice(0, 6).map((post, idx) => (
              <article
                key={`${idx}-${post.title || 'post'}`}
                className="rounded-2xl border border-zinc-200 bg-white p-5 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/40"
              >
                <div className="space-y-2">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {post.date || ''}
                  </p>
                  <h3 className="text-sm font-semibold tracking-tight">
                    {post.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {post.excerpt || ''}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

