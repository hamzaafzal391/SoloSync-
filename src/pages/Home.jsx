import { Link } from 'react-router-dom'
import smartDashboardImg from '../assets/projects/smart-dashboard.svg'
import fintechLedgerImg from '../assets/projects/fintech-ledger.svg'
import legalAssistantImg from '../assets/projects/legal-assistant.svg'
import aiDoctorImg from '../assets/projects/ai-doctor.svg'
import { Sparkles, ShieldCheck, Users, Wand2 } from 'lucide-react'

export function Home() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/25 to-fuchsia-500/25 blur-2xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-2xl" />
        </div>
        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
              <Sparkles className="h-4 w-4" />
              Build a portfolio that feels premium
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
              SoloSync helps you publish your profile and track your money in one clean app.
            </h1>
            <p className="text-pretty text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Create a public portfolio page (projects, blog, contact) and a private dashboard for
              income and debt. Guests can browse people, and you can generate insights when you ask.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/me"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Create my profile
              </Link>
              <Link
                to="/people"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Browse people
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
              <img
                src={smartDashboardImg}
                alt="SoloSync preview"
                className="h-64 w-full object-cover md:h-72"
                loading="lazy"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="min-h-[156px] rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Public profiles
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Portfolio template
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  Hero, about, projects, contact, and blog in one layout.
                </p>
              </div>
              <div className="min-h-[156px] rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Private dashboard
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Track income & debt
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  CRUD, search, charts, PDF statement, insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="min-h-[168px] rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            <Users className="h-4 w-4" />
            Directory + profiles
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Guests can explore People and open a portfolio page with projects and blog content.
          </p>
        </div>
        <div className="min-h-[168px] rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            <ShieldCheck className="h-4 w-4" />
            Clean auth
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Profiles are editable for logged-in users. Dashboard stays private behind login.
          </p>
        </div>
        <div className="min-h-[168px] rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            <Wand2 className="h-4 w-4" />
            Insights on demand
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Generate insights only when you click, so you don’t waste API quota.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
            <img
              src={fintechLedgerImg}
              alt="Finance dashboard preview"
              className="h-56 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-2 p-5">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Finance dashboard
            </p>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Add transactions, search instantly, compare income vs debt, edit and delete, and
              export a statement PDF.
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="grid grid-cols-2 gap-0 border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
            <img
              src={aiDoctorImg}
              alt="Project preview"
              className="h-56 w-full object-cover"
              loading="lazy"
            />
            <img
              src={legalAssistantImg}
              alt="Project preview"
              className="h-56 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-2 p-5">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Portfolio that shows your work
            </p>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Add project images via URL, tags, and short descriptions so your profile reads like a
              polished product page.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Ready to publish?</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Create your profile, add projects and posts, then share your public page from People.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

