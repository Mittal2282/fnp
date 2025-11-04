import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Dummy credentials
const DUMMY_USER: User = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
}

const DUMMY_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; password: string }>) => {
      const { username, password } = action.payload
      if (
        username === DUMMY_CREDENTIALS.username &&
        password === DUMMY_CREDENTIALS.password
      ) {
        state.user = DUMMY_USER
        state.isAuthenticated = true
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer

