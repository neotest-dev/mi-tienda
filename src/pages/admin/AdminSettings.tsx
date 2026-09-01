import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useStore } from '../../context/StoreContext'
import { updateStoreSettings } from '../../services/settings'
import { uploadImage } from '../../lib/storage'
import { normalizePeruWhatsAppNumber } from '../../utils/whatsapp'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import {
  Save,
  Store,
  MessageSquare,
  Upload,
  Loader2,
  CheckCircle,
  X,
  Globe,
  Share2,
  AlertCircle,
} from 'lucide-react'

export function AdminSettings() {
  const { settings, refreshSettings, loading: initialLoading } = useStore()

  const [storeName, setStoreName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (settings) {
      setStoreName(settings.store_name || '')
      setWhatsappNumber(settings.whatsapp_number || '')
      setLogoUrl(settings.logo_url || '')
      setDescription(settings.description || '')
      setAddress(settings.address || '')
      setInstagramUrl(settings.instagram_url || '')
      setFacebookUrl(settings.facebook_url || '')
      setTiktokUrl(settings.tiktok_url || '')
    }
  }, [settings])

  if (initialLoading) {
    return <LoadingSpinner text="Cargando ajustes..." />
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      setError(null)
      const url = await uploadImage(file, 'store-assets')
      setLogoUrl(url)
    } catch (err: any) {
      console.error('Logo upload error:', err)
      setError(err.message || 'Error al subir el logo')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!settings?.id) return
    if (!storeName.trim()) return setError('El nombre de la tienda es obligatorio.')

    // Validar y normalizar el número de WhatsApp para Perú (+51)
    let normalizedPhone = ''
    try {
      normalizedPhone = normalizePeruWhatsAppNumber(whatsappNumber)
    } catch (valErr: any) {
      return setError(valErr.message || 'Número de WhatsApp inválido para Perú.')
    }

    try {
      setSaving(true)
      setError(null)
      await updateStoreSettings(
        settings.id,
        {
          store_name: storeName.trim(),
          whatsapp_number: normalizedPhone,
          logo_url: logoUrl.trim() || null,
          description: description.trim() || null,
          address: address.trim() || null,
          instagram_url: instagramUrl.trim() || null,
          facebook_url: facebookUrl.trim() || null,
          tiktok_url: tiktokUrl.trim() || null,
        },
        settings.logo_url
      )

      await refreshSettings()
      setWhatsappNumber(normalizedPhone)
      setToastMessage('Configuración guardada y reflejada en la tienda pública.')
      setTimeout(() => setToastMessage(null), 4000)
    } catch (err: any) {
      console.error('Error saving settings:', err)
      setError(err.message || 'Error al guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Configuración de la Tienda
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Personaliza los datos públicos de tu negocio y el número de contacto de WhatsApp para Perú (+51)
        </p>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Store Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Store className="h-5 w-5 text-indigo-600" />
            <span>Información Principal</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Nombre de la Tienda *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Mi Tienda"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                WhatsApp Perú (+51) *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+51 972874719"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Acepta: <code className="font-mono">+51 972874719</code> o <code className="font-mono">972874719</code> (Celular de 9 dígitos)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Descripción Corta de la Tienda
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Los mejores productos tecnológicos y ofertas exclusivas..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
            />
          </div>

          {/* Logo Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Logo de la Tienda (Recomendado 512x512 px)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {logoUrl ? (
                <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 p-1">
                  <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0 font-bold text-2xl">
                  {storeName ? storeName.charAt(0).toUpperCase() : '?'}
                </div>
              )}

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer transition-colors">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  ) : (
                    <Upload className="h-4 w-4 text-slate-500" />
                  )}
                  <span>{uploading ? 'Optimizando a WebP...' : 'Subir e Convertir a WebP'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                <div>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="O pega una URL directa del logo..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Extra Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-600" />
            <span>Redes Sociales y Dirección</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-pink-600" /> Instagram
              </label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/mitienda"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-600" /> Facebook
              </label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/mitienda"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-slate-800" /> TikTok
              </label>
              <input
                type="text"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://tiktok.com/@mitienda"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Dirección Física (Opcional)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. Principal 123, Oficina 402"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Guardando cambios...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Guardar Configuración</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
