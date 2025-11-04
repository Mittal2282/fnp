import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { useEffect, useState } from 'react'
import WelcomeSplash from './components/WelcomeSplash'
import { useAppSelector } from './store/hooks'
import Login from './pages/Login'
import AppLayout from './components/AppLayout'
import ProductList from './pages/ProductList'
import ProductCreate from './pages/ProductCreate'
import ProductEdit from './pages/ProductEdit'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      setShowSplash(true)
    }
  }, [isAuthenticated])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#556b2f',
          colorInfo: '#8a9a5b',
          colorLink: '#556b2f',
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/products" replace /> : <Login />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/create" element={<ProductCreate />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
          </Route>
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
        {showSplash && <WelcomeSplash onDone={() => setShowSplash(false)} />}
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
