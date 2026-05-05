import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    authReady: false,
  },
  reducers: {
    setAuthUser(state, action) {
      state.user = action.payload
    },
    setAuthReady(state, action) {
      state.authReady = action.payload
    },
  },
})

export const { setAuthUser, setAuthReady } = authSlice.actions
export default authSlice.reducer
