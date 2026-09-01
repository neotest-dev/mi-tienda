import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useStore } from '../../context/StoreContext'
import {
  LayoutDashboard,
  Package,
  Tags,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react'

export function AdminLayout() {
  const navigate = useNavigate()
  const { settings } = useStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const storeName = settings?.store_name || 'Mi Tienda'
  const logoUrl = settings?.logo_url

  const navItems = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Productos', to: '/admin/products', icon: Package },
    { label: 'Categorías', to: '/admin/categories', icon: Tags },
    { label: 'Configuración', to: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Sticky Liquid-Glass Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 flex items-center justify-between border-b border-slate-800/80 shadow-lg">
        <div className="flex items-center gap-2.5 min-w-0">
          {logoUrl ? (
            <img src={logoUrl} alt={storeName} className="h-7 w-7 object-contain rounded-lg bg-white/10 p-0.5 shrink-0" />
          ) : (
            <Store className="h-5 w-5 text-indigo-400 shrink-0" />
          )}
          <span className="font-bold text-sm truncate max-w-[140px]">{storeName}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            target="_blank"
            className="px-2.5 py-1.5 bg-indigo-600/30 text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Tienda</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-800/80 focus:outline-none cursor-pointer"
            aria-label="Abrir menú"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Modal Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm md:hidden flex flex-col justify-between p-6 animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt={storeName} className="h-9 w-9 object-contain rounded-xl bg-white/10 p-1" />
                ) : (
                  <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base">
                    {storeName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-base">{storeName}</h3>
                  <span className="text-xs text-indigo-400 font-medium">Panel Admin</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-800" onClick={(e) => e.stopPropagation()}>
            <Link
              to="/"
              target="_blank"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600/20 text-indigo-300 font-semibold text-sm rounded-xl border border-indigo-500/30"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Ir a la Tienda Pública</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-400 font-semibold text-sm rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-10 w-10 object-contain rounded-xl bg-white/10 p-1 border border-white/10 shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {storeName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <h2 className="font-bold text-white text-base leading-snug truncate">{storeName}</h2>
                <span className="text-xs text-indigo-400 font-medium">Panel de Control</span>
              </div>
            </div>

            {/* Prominent Quick Link to Public Store */}
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Ver Tienda Pública</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
