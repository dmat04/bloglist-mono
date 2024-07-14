import { configureStore } from '@reduxjs/toolkit'
import notificationSlice from './reducers/notificationSlice'
import authSlice from './reducers/authSlice'
import { baseApi } from './reducers/baseApi'

const store = configureStore({
  reducer: {
    notification: notificationSlice.reducer,
    auth: authSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export default store
