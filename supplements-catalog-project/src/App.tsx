import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import AOS from 'aos'
import { Navbar } from './components/Navbar'
import { BottomTabBar } from './components/BottomTabBar'
import { Footer } from './components/Footer'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Catalog } from './pages/Catalog'
import { ProductDetail } from './pages/ProductDetail'
import { Search } from './pages/Search'
import { Cart } from './pages/Cart'
import { Account } from './pages/Account'
import { Admin } from './pages/Admin'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

function App() {
  const location = useLocation()

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 40 })
  }, [])

  useEffect(() => {
    AOS.refresh()
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/catalogo/:id" element={<ProductDetail />} />
          <Route path="/buscar" element={<Search />} />
          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cuenta"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <BottomTabBar />
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}

export default App
