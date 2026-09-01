import { Link } from 'react-router-dom'
import { ShoppingBag, ShieldCheck } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

export function Header() {
  const { settings } = useStore()

  const storeName = settings?.store_name || 'Mi Tienda'
  const logoUrl = settings?.logo_url

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Store Name */}
        <Link to="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={storeName}
              className="h-10 w-10 object-contain rounded-lg border border-slate-100 p-0.5"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
              {storeName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-lg text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
            {storeName}
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Catálogo</span>
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Panel Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
