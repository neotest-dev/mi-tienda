import type { Tables, TablesInsert, TablesUpdate } from './database.types'

export type Category = Tables<'categories'>
export type CategoryInsert = TablesInsert<'categories'>
export type CategoryUpdate = TablesUpdate<'categories'>

export type Product = Tables<'products'>
export type ProductInsert = TablesInsert<'products'>
export type ProductUpdate = TablesUpdate<'products'>

export type StoreSettings = Tables<'store_settings'>
export type StoreSettingsInsert = TablesInsert<'store_settings'>
export type StoreSettingsUpdate = TablesUpdate<'store_settings'>

export interface ProductWithCategory extends Product {
  category?: Category | null
}
