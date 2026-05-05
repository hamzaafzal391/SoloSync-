import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'

function buildSample(transactions) {
  const sorted = [...transactions].sort((a, b) => {
    const da = String(a.date || '')
    const db = String(b.date || '')
    if (da === db) return 0
    return da > db ? -1 : 1
  })
  return sorted.slice(0, 12).map((t) => ({
    title: t.title ?? '',
    type: t.type ?? '',
    amount: t.amount ?? 0,
    date: t.date ?? '',
  }))
}

export function AIInsights({ totalIncome, totalDebt, balance }) {
  const transactions = useSelector((s) => s.ledger.transactions)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState(null)

  const derived = useMemo(() => {
    const byTitle = {}
    const byCategory = {}
    const norm = (s) =>
      String(s || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .slice(0, 120)

    const infer = (title) => {
      const t = norm(title)
      if (!t) return 'Other'
      if (/(student loan|loan|lender|credit|interest|installment)/.test(t)) return 'Loans'
      if (/(rent|landlord|lease|mortgage)/.test(t)) return 'Housing'
      if (/(grocery|market|supermarket|food|restaurant|cafe|coffee|meal)/.test(t))
        return 'Food'
      if (/(uber|lyft|taxi|bus|train|metro|gas|fuel|transport)/.test(t))
        return 'Transport'
      if (/(netflix|spotify|subscription|subscr|membership|prime)/.test(t))
        return 'Subscriptions'
      if (/(phone|internet|wifi|utility|electric|water|bill)/.test(t)) return 'Bills'
      if (/(tuition|school|course|university|college|books)/.test(t)) return 'Education'
      if (/(doctor|clinic|pharmacy|medical|health)/.test(t)) return 'Health'
      return 'Other'
    }

    transactions.forEach((t) => {
      const k = norm(t.title)
      if (k) byTitle[k] = (byTitle[k] || 0) + 1
      const c = infer(t.title)
      const sign = t.type === 'Debt' ? -1 : 1
      byCategory[c] = (byCategory[c] || 0) + sign * (Number(t.amount) || 0)
    })

    const recurringTitles = Object.entries(byTitle)
      .filter(([, c]) => c >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([title, count]) => ({ title, count }))

    const categoryNet = Object.entries(byCategory)
      .map(([category, net]) => ({ category, net }))
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net))
      .slice(0, 10)

    return { recurringTitles, categoryNet }
  }, [transactions])

  const payload = useMemo(
    () => ({
      totals: {
        totalIncome,
        totalDebt,
        balance,
        count: transactions.length,
      },
      sample: buildSample(transactions),
      recurringTitles: derived.recurringTitles,
      categoryNet: derived.categoryNet,
    }),
    [totalIncome, totalDebt, balance, transactions, derived],
  )

  async function generate() {
    if (transactions.length === 0) {
      toast.error('Add transactions first')
      return
    }
    setLoading(true)
    try {
      const resp = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok) throw new Error(data?.error || 'Failed to fetch insights')
      setText(String(data?.text || '').trim())
      setMeta({ finishReason: data?.finishReason || null })
    } catch (e) {
      setText('')
      setMeta(null)
      toast.error(e?.message || 'AI insights failed')
    } finally {
      setLoading(false)
    }
  }

  const lines = useMemo(() => {
    const raw = (text || '').trim()
    if (!raw) return []
    return raw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  }, [text])

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Balance: {balance}
        </p>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? 'Generating…' : text ? 'Refresh insights' : 'Generate insights'}
        </button>
      </div>
      <div className="mt-3 max-h-72 space-y-2 overflow-auto pr-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {lines.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            Click “Generate insights” to get personalized recommendations.
          </p>
        ) : (
          lines.map((l, idx) => {
            const isKey =
              l.startsWith('Insight ') || l.startsWith('Plan:') || l.startsWith('Warning:')
            return (
              <p
                key={`${idx}-${l}`}
                className={
                  isKey
                    ? 'break-words font-semibold text-zinc-900 dark:text-zinc-50'
                    : 'break-words'
                }
              >
                {l}
              </p>
            )
          })
        )}
      </div>
      {meta?.finishReason ? (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Model finish: {meta.finishReason}
        </p>
      ) : null}
    </div>
  )
}

