import { ProductCard } from './ProductCard'
import type { ProductWithCategory } from '../../types/store'

interface ProductGridProps {
  products: ProductWithCategory[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
