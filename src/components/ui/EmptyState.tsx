import { PackageSearch } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  onReset?: () => void
}

export function EmptyState({
  title = 'No se encontraron productos',
  description = 'Intenta seleccionar otra categoría o buscar de nuevo.',
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 my-6">
      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4">
        <PackageSearch className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Ver todos los productos
        </button>
      )}
    </div>
  )
}
