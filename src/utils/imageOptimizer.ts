export interface OptimizeOptions {
  maxWidth: number
  maxHeight: number
  quality?: number
}

export async function processAndOptimizeImage(
  file: File,
  options: OptimizeOptions
): Promise<File> {
  // 1. Validar tipo de archivo
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('El archivo seleccionado debe ser una imagen válida (JPG, PNG, WEBP, etc.).')
  }

  // 2. Validar tamaño máximo antes de optimizar (ej. 10MB)
  const maxOriginalBytes = 10 * 1024 * 1024
  if (file.size > maxOriginalBytes) {
    throw new Error('El archivo de imagen es demasiado grande. El tamaño máximo permitido es 10 MB.')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const { maxWidth, maxHeight, quality = 0.82 } = options

        let width = img.width
        let height = img.height

        // Redimensionar manteniendo proporción
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo inicializar el procesador de imágenes en el navegador.'))
          return
        }

        // Calidad de renderizado
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al convertir y comprimir la imagen.'))
              return
            }

            const nameParts = file.name.split('.')
            nameParts.pop()
            const baseName = nameParts.join('.') || 'image'

            const optimizedFile = new File([blob], `${baseName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            })

            resolve(optimizedFile)
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('La imagen seleccionada está dañada o no se puede procesar.'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Error al leer la imagen seleccionada.'))
    }

    reader.readAsDataURL(file)
  })
}
