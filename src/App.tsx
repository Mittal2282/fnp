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
import Landing from './pages/Landing'

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
          {/* Public landing page at root */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/products" replace /> : <Login />}
          />
          {/* Protected app routes under the same base for existing paths */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="products" element={<ProductList />} />
            <Route path="products/create" element={<ProductCreate />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {showSplash && <WelcomeSplash onDone={() => setShowSplash(false)} />}
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
