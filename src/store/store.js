import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import ledgerReducer from './ledgerSlice'
import profilesReducer from './profilesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ledger: ledgerReducer,
    profiles: profilesReducer,
  },
})
