import { useCallback, useEffect, useMemo, useState } from 'react'
import { signOut } from 'firebase/auth'
import jsPDF from 'jspdf'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { auth, db } from '../firebase'
import { setTransactions } from '../store/ledgerSlice'

export function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const transactions = useSelector((s) => s.ledger.transactions)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('Income')

  const [searchQuery, setSearchQuery] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editType, setEditType] = useState('Income')

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'Income')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [transactions],
  )

  const totalDebt = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'Debt')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [transactions],
  )

  const balance = totalIncome - totalDebt

  const chartData = useMemo(
    () => [
      { name: 'Income', value: totalIncome },
      { name: 'Debt', value: totalDebt },
    ],
    [totalIncome, totalDebt],
  )

  const syncTransactions = useCallback(async () => {
    if (!user?.uid) return
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
      )
      const snap = await getDocs(q)
      const list = snap.docs.map((d) => {
        const data = d.data() || {}
        return {
          id: d.id,
          title: data.title ?? '',
          amount: Number(data.amount) || 0,
          type: data.type ?? 'Income',
          date: data.date ?? '',
        }
      })
      dispatch(setTransactions(list))
    } catch (e) {
      toast.error(e?.message || 'Failed to load transactions')
    }
  }, [dispatch, user])

  useEffect(() => {
    syncTransactions()
  }, [syncTransactions])

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return transactions
    return transactions.filter((t) => (t.title ?? '').toLowerCase().includes(q))
  }, [transactions, searchQuery])

  async function handleSignOut() {
    await signOut(auth)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!user?.uid) return
    const t = title.trim()
    const a = Number(amount)
    if (!t) {
      toast.error('Title is required')
      return
    }
    if (!Number.isFinite(a)) {
      toast.error('Amount must be a number')
      return
    }
    try {
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        title: t,
        amount: a,
        type,
        date: new Date().toISOString().slice(0, 10),
      })
      toast.success('Transaction added')
      setTitle('')
      setAmount('')
      setType('Income')
      await syncTransactions()
    } catch (e2) {
      toast.error(e2?.message || 'Failed to add transaction')
    }
  }

  function startEdit(tx) {
    setEditingId(tx.id)
    setEditTitle(tx.title ?? '')
    setEditAmount(String(tx.amount ?? 0))
    setEditType(tx.type ?? 'Income')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditAmount('')
    setEditType('Income')
  }

  async function handleSaveEdit(id) {
    const t = editTitle.trim()
    const a = Number(editAmount)
    if (!t) {
      toast.error('Title is required')
      return
    }
    if (!Number.isFinite(a)) {
      toast.error('Amount must be a number')
      return
    }
    try {
      await updateDoc(doc(db, 'transactions', id), {
        title: t,
        amount: a,
        type: editType,
      })
      toast.success('Transaction updated')
      cancelEdit()
      await syncTransactions()
    } catch (e) {
      toast.error(e?.message || 'Failed to update transaction')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'transactions', id))
      toast.success('Transaction deleted')
      await syncTransactions()
    } catch (e) {
      toast.error(e?.message || 'Failed to delete transaction')
    }
  }

  function handleDownloadPdf() {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export')
      return
    }
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('Transaction Statement', 14, 18)
    doc.setFontSize(10)
    doc.text(`Total income: ${totalIncome}`, 14, 26)
    doc.text(`Total debt: ${totalDebt}`, 14, 32)
    doc.text(`Balance: ${balance}`, 14, 38)

    const startY = 48
    let y = startY
    doc.setFontSize(10)
    doc.text('Title', 14, y)
    doc.text('Type', 80, y)
    doc.text('Amount', 120, y)
    doc.text('Date', 160, y)
    y += 6

    filteredTransactions.forEach((t) => {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(String(t.title ?? ''), 14, y)
      doc.text(String(t.type ?? ''), 80, y)
      doc.text(String(t.amount ?? ''), 120, y)
      doc.text(String(t.date ?? ''), 160, y)
      y += 6
    })

    doc.save('statement.pdf')
    toast.success('Statement downloaded')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Signed in as {user?.email ?? user?.uid}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Sign out
        </button>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Analytics overview
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Snapshot of your total income and debt.
            </p>
            <div className="mt-2 h-56 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-4 dark:border-zinc-800 dark:bg-zinc-900/30">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#18181b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">AI insights</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Balance based on your current ledger.
            </p>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Balance: {balance}
              </p>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                {balance < 0
                  ? 'AI Tip: Your debt is high. Consider reducing discretionary spending.'
                  : 'AI Tip: Great job! You have a surplus. Consider investing 10%.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold tracking-tight">Add transaction</h2>
        <form onSubmit={handleAdd} className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Title
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Amount
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Type
            </span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            >
              <option value="Income">Income</option>
              <option value="Debt">Debt</option>
            </select>
          </label>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Add transaction
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Transactions</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Search and manage your data.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:max-w-xs">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Download statement
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="px-2 py-2 font-semibold">Title</th>
                <th className="px-2 py-2 font-semibold">Type</th>
                <th className="px-2 py-2 text-right font-semibold">Amount</th>
                <th className="px-2 py-2 font-semibold">Date</th>
                <th className="px-2 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-2 py-6 text-center text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    {transactions.length === 0
                      ? 'No transactions yet.'
                      : 'No matching transactions.'}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const isEditing = editingId === t.id
                  return (
                    <tr key={t.id}>
                      {isEditing ? (
                        <>
                          <td className="px-2 py-3">
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                            />
                          </td>
                          <td className="px-2 py-3">
                            <select
                              value={editType}
                              onChange={(e) => setEditType(e.target.value)}
                              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                            >
                              <option value="Income">Income</option>
                              <option value="Debt">Debt</option>
                            </select>
                          </td>
                          <td className="px-2 py-3 text-right">
                            <input
                              type="number"
                              inputMode="decimal"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-28 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                            />
                          </td>
                          <td className="px-2 py-3 text-zinc-600 dark:text-zinc-300">
                            {t.date}
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(t.id)}
                                className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-3 font-medium">{t.title}</td>
                          <td className="px-2 py-3">
                            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                              {t.type}
                            </span>
                          </td>
                          <td className="px-2 py-3 text-right text-zinc-700 dark:text-zinc-200">
                            {t.amount}
                          </td>
                          <td className="px-2 py-3 text-zinc-600 dark:text-zinc-300">
                            {t.date}
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(t)}
                                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(t.id)}
                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
