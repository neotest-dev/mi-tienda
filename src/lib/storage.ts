import { supabase } from './supabase'
import { processAndOptimizeImage } from '../utils/imageOptimizer'

export async function uploadImage(
  file: File,
  bucket: 'products' | 'store-assets' = 'products'
): Promise<string> {
  // Configuración de redimensionado según bucket
  const optimizeOptions =
    bucket === 'store-assets'
      ? { maxWidth: 512, maxHeight: 512, quality: 0.85 }
      : { maxWidth: 1200, maxHeight: 1200, quality: 0.82 }

  // 1. Optimizar y convertir la imagen a WebP
  const optimizedFile = await processAndOptimizeImage(file, optimizeOptions)

  // 2. Generar nombre de archivo único con extensión .webp
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`
  const filePath = `${fileName}`

  // 3. Subir a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, optimizedFile, {
      cacheControl: '31536000',
      contentType: 'image/webp',
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Error al subir imagen a Supabase Storage: ${uploadError.message}`)
  }

  // 4. Retornar URL pública
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Elimina una imagen existente en el bucket de Supabase Storage dada su URL pública.
 */
export async function deleteImageByUrl(
  imageUrl: string | null | undefined,
  bucket: 'products' | 'store-assets' = 'products'
): Promise<void> {
  if (!imageUrl || !imageUrl.trim()) return

  try {
    // Si la URL no pertenece a Supabase Storage (ej. Unsplash externa), no hacer nada
    if (!imageUrl.includes(`/storage/v1/object/public/${bucket}/`)) {
      return
    }

    const urlParts = imageUrl.split(`/storage/v1/object/public/${bucket}/`)
    if (urlParts.length < 2) return

    const filePath = urlParts[1]
    if (!filePath) return

    const { error } = await supabase.storage.from(bucket).remove([filePath])
    if (error) {
      console.warn(`Advertencia al eliminar archivo anterior de Storage (${filePath}):`, error.message)
    }
  } catch (err) {
    console.warn('Excepción en deleteImageByUrl:', err)
  }
}
