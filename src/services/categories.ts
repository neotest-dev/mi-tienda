import { supabase } from '../lib/supabase'
import type { Category, CategoryInsert, CategoryUpdate } from '../types/store'

export async function getCategories(onlyActive = true): Promise<Category[]> {
  let query = supabase.from('categories').select('*').order('name', { ascending: true })

  if (onlyActive) {
    query = query.eq('active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Error al cargar las categorías.')
  }

  return data || []
}

export async function createCategory(category: CategoryInsert): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Error al crear categoría: ${error.message}`)
  }

  return data
}

export async function updateCategory(
  id: string,
  category: CategoryUpdate
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Error al actualizar categoría: ${error.message}`)
  }

  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    throw new Error(`Error al eliminar categoría: ${error.message}`)
  }
}

export async function toggleCategoryActive(id: string, active: boolean): Promise<Category> {
  return updateCategory(id, { active })
}
