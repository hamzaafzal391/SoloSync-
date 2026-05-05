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
      prepare({ label, amount, date }) {
        return {
          payload: {
            id: nanoid(),
            label: label ?? '',
            amount: Number(amount) || 0,
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
  },
})

export const { addTransaction, setTransactions, removeTransaction } =
  ledgerSlice.actions
export default ledgerSlice.reducer
