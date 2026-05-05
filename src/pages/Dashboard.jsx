import { useCallback, useEffect, useMemo, useState } from 'react'
import { signOut } from 'firebase/auth'
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
          <div className="w-full sm:max-w-xs">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
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
