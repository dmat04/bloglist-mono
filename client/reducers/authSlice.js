import { createSlice } from '@reduxjs/toolkit'

const LOCAL_STORAGE_KEY_AUTH_TOKEN = 'LOCAL_STORAGE_KEY_AUTH_TOKEN'
const initialState = {
  token: null,
  username: null,
  name: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    getFromLocalStorage() {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY_AUTH_TOKEN)
      if (stored) {
        const token = JSON.parse(stored)
        return token
      } else {
        return initialState
      }
    },
    setUser(state, action) {
      const token = action.payload
      window.localStorage.setItem(LOCAL_STORAGE_KEY_AUTH_TOKEN, JSON.stringify(token))
      return token
    },
    clearUser() {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH_TOKEN)
      return initialState
    }
  }
})

export const { getFromLocalStorage, setUser, clearUser } = authSlice.actions
export default authSlice

