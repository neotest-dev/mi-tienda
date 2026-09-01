import { supabase } from '../lib/supabase'
import { deleteImageByUrl } from '../lib/storage'
import type { StoreSettings, StoreSettingsUpdate } from '../types/store'

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching store settings:', error)
    return null
  }

  return data
}

export async function updateStoreSettings(
  id: string,
  settings: StoreSettingsUpdate,
  oldLogoUrl?: string | null
): Promise<StoreSettings> {
  // Si la URL del logo cambió y existía un logo previo, eliminar el logo anterior de Storage
  if (oldLogoUrl && settings.logo_url !== oldLogoUrl) {
    await deleteImageByUrl(oldLogoUrl, 'store-assets')
  }

  const { data, error } = await supabase
    .from('store_settings')
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Error al actualizar configuración: ${error.message}`)
  }

  return data
}
