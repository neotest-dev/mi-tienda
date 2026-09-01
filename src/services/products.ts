import { supabase } from '../lib/supabase'
import { deleteImageByUrl } from '../lib/storage'
import type { ProductInsert, ProductUpdate, ProductWithCategory } from '../types/store'

export async function getProducts(
  categoryId?: string | null,
  onlyActive = true
): Promise<ProductWithCategory[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false })

  if (onlyActive) {
    query = query.eq('active', true)
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error('Error al obtener los productos.')
  }

  return (data as ProductWithCategory[]) || []
}

export async function getProductBySlugOrId(
  slugOrId: string
): Promise<ProductWithCategory | null> {
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId)

  let query = supabase.from('products').select('*, category:categories(*)')

  if (isUuid) {
    query = query.eq('id', slugOrId)
  } else {
    query = query.eq('slug', slugOrId)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    console.error('Error fetching product by slug/id:', error)
    return null
  }

  return data as ProductWithCategory | null
}

export async function createProduct(
  product: ProductInsert
): Promise<ProductWithCategory> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select('*, category:categories(*)')
    .single()

  if (error) {
    throw new Error(`Error al crear producto: ${error.message}`)
  }

  return data as ProductWithCategory
}

export async function updateProduct(
  id: string,
  product: ProductUpdate,
  oldImageUrl?: string | null
): Promise<ProductWithCategory> {
  // Si la imagen cambió y había una imagen anterior, eliminarla de Storage
  if (oldImageUrl && product.image_url !== oldImageUrl) {
    await deleteImageByUrl(oldImageUrl, 'products')
  }

  const { data, error } = await supabase
    .from('products')
    .update({
      ...product,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, category:categories(*)')
    .single()

  if (error) {
    throw new Error(`Error al actualizar producto: ${error.message}`)
  }

  return data as ProductWithCategory
}

export async function deleteProduct(id: string): Promise<void> {
  // 1. Obtener datos del producto para extraer la imagen a eliminar
  const { data: existingProduct } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', id)
    .maybeSingle()

  if (existingProduct?.image_url) {
    await deleteImageByUrl(existingProduct.image_url, 'products')
  }

  // 2. Eliminar registro de la base de datos
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    throw new Error(`Error al eliminar producto: ${error.message}`)
  }
}

export async function toggleProductActive(
  id: string,
  active: boolean
): Promise<ProductWithCategory> {
  return updateProduct(id, { active })
}
