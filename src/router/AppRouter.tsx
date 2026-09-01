import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from '../pages/Home'
import { ProductDetail } from '../pages/ProductDetail'
import { Login } from '../pages/admin/Login'
import { AdminLayout } from '../components/layout/AdminLayout'
import { ProtectedRoute } from '../components/admin/ProtectedRoute'
import { Dashboard } from '../pages/admin/Dashboard'
import { AdminProducts } from '../pages/admin/AdminProducts'
import { AdminCategories } from '../pages/admin/AdminCategories'
import { AdminSettings } from '../pages/admin/AdminSettings'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public Store Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/producto/:slug"
        element={
          <PublicLayout>
            <ProductDetail />
          </PublicLayout>
        }
      />

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
