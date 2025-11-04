import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'

const loadAuthState = () => {
  try {
    const serialized = localStorage.getItem('authState')
    if (!serialized) return undefined
    return JSON.parse(serialized)
  } catch (_e) {
    return undefined
  }
}

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    product: productReducer,
  },
  preloadedState: {
    auth: loadAuthState(),
  },
})

store.subscribe(() => {
  try {
    const state = store.getState()
    const serialized = JSON.stringify(state.auth)
    localStorage.setItem('authState', serialized)
  } catch (_e) {
    // ignore write errors
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
