import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: null,
  isError: false,
  timeoutId: null,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return initialState
    }
  }
})

const { setNotification, clearNotification } = notificationSlice.actions

const setTimedNotification = (message, timeout = 5000, isError) => {
  return (dispatch, getState) => {
    const existingTimeout = getState().notification.timeoutId
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    const timeoutId = setTimeout(
      () => dispatch(clearNotification()),
      timeout
    )
    dispatch(setNotification({ message: message, isError: isError, timeoutId: timeoutId }))
  }
}

export const showNotification = (message) => {
  return setTimedNotification(message, 5000, false)
}

export const showError = (message) => {
  return setTimedNotification(message, 5000, true)
}

export default notificationSlice