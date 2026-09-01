import { useStore } from '../../context/StoreContext'
import { Globe, Share2 } from 'lucide-react'

export function Footer() {
  const { settings } = useStore()
  const storeName = settings?.store_name || 'Mi Tienda'
  const description = settings?.description || 'Tu tienda online de confianza.'

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">{storeName}</h3>
            <p className="text-sm text-slate-400 max-w-md">{description}</p>
          </div>
          <div className="flex items-center gap-4">
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Share2 className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
        <div className="pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {storeName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
