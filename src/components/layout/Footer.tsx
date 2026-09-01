import { useStore } from '../../context/StoreContext'
import { InstagramIcon, FacebookIcon, TikTokIcon } from '../ui/SocialIcons'
import { MapPin } from 'lucide-react'

export function Footer() {
  const { settings } = useStore()
  const storeName = settings?.store_name || 'Mi Tienda'
  const logoUrl = settings?.logo_url
  const description = settings?.description || 'Tu tienda online de confianza.'

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName}
                className="h-12 w-12 object-contain rounded-xl bg-white/10 p-1 border border-white/10 shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-white font-bold text-lg mb-1">{storeName}</h3>
              <p className="text-sm text-slate-400 max-w-md">{description}</p>
              {settings?.address && (
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>{settings.address}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white rounded-xl transition-all duration-200"
                aria-label="Instagram"
                title="Síguenos en Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-all duration-200"
                aria-label="Facebook"
                title="Síguenos en Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
            {settings?.tiktok_url && (
              <a
                href={settings.tiktok_url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all duration-200"
                aria-label="TikTok"
                title="Síguenos en TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
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
