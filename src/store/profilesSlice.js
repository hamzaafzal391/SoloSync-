import { createSlice } from '@reduxjs/toolkit'

const profilesSlice = createSlice({
  name: 'profiles',
  initialState: {
    people: [],
    peopleStatus: 'idle',
    peopleError: '',
    publicProfile: null,
    publicStatus: 'idle',
    publicError: '',
    myProfile: null,
    myStatus: 'idle',
    myError: '',
  },
  reducers: {
    setPeople(state, action) {
      state.people = action.payload
    },
    setPeopleStatus(state, action) {
      state.peopleStatus = action.payload
    },
    setPeopleError(state, action) {
      state.peopleError = action.payload
    },
    setPublicProfile(state, action) {
      state.publicProfile = action.payload
    },
    setPublicStatus(state, action) {
      state.publicStatus = action.payload
    },
    setPublicError(state, action) {
      state.publicError = action.payload
    },
    setMyProfile(state, action) {
      state.myProfile = action.payload
    },
    setMyStatus(state, action) {
      state.myStatus = action.payload
    },
    setMyError(state, action) {
      state.myError = action.payload
    },
  },
})

export const {
  setPeople,
  setPeopleStatus,
  setPeopleError,
  setPublicProfile,
  setPublicStatus,
  setPublicError,
  setMyProfile,
  setMyStatus,
  setMyError,
} = profilesSlice.actions
export default profilesSlice.reducer

