import { createSlice, nanoid } from '@reduxjs/toolkit'

const ledgerSlice = createSlice({
  name: 'ledger',
  initialState: {
    transactions: [],
  },
  reducers: {
    addTransaction: {
      reducer(state, action) {
        state.transactions.push(action.payload)
      },
      prepare({ title, amount, type, date }) {
        return {
          payload: {
            id: nanoid(),
            title: title ?? '',
            amount: Number(amount) || 0,
            type: type ?? 'Income',
            date: date ?? new Date().toISOString().slice(0, 10),
          },
        }
      },
    },
    setTransactions(state, action) {
      state.transactions = action.payload
    },
    removeTransaction(state, action) {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload,
      )
    },
    updateTransaction(state, action) {
      const { id, title, amount, type } = action.payload
      const tx = state.transactions.find((t) => t.id === id)
      if (!tx) return
      tx.title = title
      tx.amount = amount
      tx.type = type
    },
  },
})

export const {
  addTransaction,
  setTransactions,
  removeTransaction,
  updateTransaction,
} = ledgerSlice.actions
export default ledgerSlice.reducer
