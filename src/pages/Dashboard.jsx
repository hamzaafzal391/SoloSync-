import { signOut } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../firebase'
import { addTransaction } from '../store/ledgerSlice'

export function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const transactions = useSelector((s) => s.ledger.transactions)

  async function handleSignOut() {
    await signOut(auth)
  }

  function handleAddSample() {
    dispatch(
      addTransaction({
        label: 'Sample entry',
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
      }),
    )
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Ledger</h2>
          <button
            type="button"
            onClick={handleAddSample}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Add sample row
          </button>
        </div>
        {transactions.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            No transactions yet. Add one to see it in Redux.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {t.label}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {t.date} · {t.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
