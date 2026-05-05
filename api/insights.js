function normTitle(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .slice(0, 120)
}

function inferCategory(title) {
  const t = normTitle(title)
  if (!t) return 'Other'
  if (/(student loan|loan|lender|credit|interest|installment)/.test(t)) return 'Loans'
  if (/(rent|landlord|lease|mortgage)/.test(t)) return 'Housing'
  if (/(grocery|market|supermarket|food|restaurant|cafe|coffee|meal)/.test(t)) return 'Food'
  if (/(uber|lyft|taxi|bus|train|metro|gas|fuel|transport)/.test(t)) return 'Transport'
  if (/(netflix|spotify|subscription|subscr|membership|prime)/.test(t)) return 'Subscriptions'
  if (/(phone|internet|wifi|utility|electric|water|bill)/.test(t)) return 'Bills'
  if (/(tuition|school|course|university|college|books)/.test(t)) return 'Education'
  if (/(doctor|clinic|pharmacy|medical|health)/.test(t)) return 'Health'
  return 'Other'
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  return JSON.parse(raw)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Missing GEMINI_API_KEY' })
    return
  }

  let body
  try {
    body = await readJson(req)
  } catch {
    res.status(400).json({ error: 'Invalid JSON' })
    return
  }

  const totals = body.totals || {}
  const sample = Array.isArray(body.sample) ? body.sample.slice(0, 25) : []

  const txs = sample.map((t) => ({
    title: String(t.title ?? '').slice(0, 80),
    type: t.type === 'Debt' ? 'Debt' : 'Income',
    amount: Number(t.amount) || 0,
    date: String(t.date ?? '').slice(0, 10),
    category: inferCategory(t.title),
  }))

  const recurring = Object.entries(
    txs.reduce((acc, t) => {
      const k = normTitle(t.title)
      if (!k) return acc
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {}),
  )
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([title, count]) => ({ title, count }))

  const byCategory = Object.entries(
    txs.reduce((acc, t) => {
      const k = t.category || 'Other'
      const sign = t.type === 'Debt' ? -1 : 1
      acc[k] = (acc[k] || 0) + sign * (Number(t.amount) || 0)
      return acc
    }, {}),
  )
    .map(([category, net]) => ({ category, net }))
    .sort((a, b) => Math.abs(b.net) - Math.abs(a.net))
    .slice(0, 8)

  const topDebts = txs
    .filter((t) => t.type === 'Debt')
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 5)
  const topIncome = txs
    .filter((t) => t.type === 'Income')
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 5)

  const prompt = [
    'You are a strict personal finance coach.',
    'You will be given totals and recent transactions with rough categories inferred from titles.',
    'Your job is to produce specific, personalized and actionable advice based on patterns in the data.',
    'Rules: no markdown, no headings, no fluff, no disclaimers.',
    'Must reference at least 2 concrete transaction titles or categories when giving advice.',
    'If loans are present (category Loans or title contains student loan), include a short payoff strategy: avalanche vs snowball, and a suggested monthly target as a % of income (pick a reasonable %).',
    'If recurring titles exist, call them out as likely subscriptions or repeated spending and recommend what to cut/renegotiate.',
    'Do not end mid-sentence. End your response with the token "END".',
    'Output format exactly:',
    'Insight 1: ...',
    'Insight 2: ...',
    'Insight 3: ...',
    'Plan: ...',
    'Plan: ...',
    'Warning: ... (only if there is a major risk, else write "Warning: none")',
  ].join(' ')

  const user = {
    totals: {
      totalIncome: Number(totals.totalIncome) || 0,
      totalDebt: Number(totals.totalDebt) || 0,
      balance: Number(totals.balance) || 0,
      count: Number(totals.count) || 0,
    },
    recentTransactions: txs,
    recurringTitles: recurring,
    categoryNet: byCategory,
    topDebts,
    topIncome,
    clientCategoryNet: Array.isArray(body.categoryNet) ? body.categoryNet.slice(0, 10) : [],
    clientRecurringTitles: Array.isArray(body.recurringTitles)
      ? body.recurringTitles.slice(0, 10)
      : [],
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  async function callGemini(maxOutputTokens) {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt + '\n\n' + JSON.stringify(user) }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens,
        },
      }),
    })
    const data = await resp.json().catch(() => ({}))
    return { resp, data }
  }

  try {
    let { resp, data } = await callGemini(900)

    if (!resp.ok) {
      res.status(resp.status).json({
        error:
          data?.error?.message ||
          data?.message ||
          resp.statusText ||
          'Gemini request failed',
        details: data,
      })
      return
    }

    let text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p?.text)
        .filter(Boolean)
        .join('') || ''

    if (text && !String(text).trim().endsWith('END')) {
      const retry = await callGemini(1400)
      if (retry.resp.ok) {
        const retryText =
          retry.data?.candidates?.[0]?.content?.parts
            ?.map((p) => p?.text)
            .filter(Boolean)
            .join('') || ''
        if (retryText) {
          text = retryText
          data = retry.data
        }
      }
    }

    text = String(text || '').replace(/\s*END\s*$/, '').trim()
    res.status(200).json({
      text,
      finishReason: data?.candidates?.[0]?.finishReason || null,
    })
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Server error' })
  }
}

