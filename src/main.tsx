import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { addProduct } from './store/slices/productSlice'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

// Attach bulk upload bridge
window.addEventListener('bulk:addProduct', (e: any) => {
  try {
    store.dispatch(addProduct(e.detail))
  } catch (_e) {
    // ignore
  }
})
