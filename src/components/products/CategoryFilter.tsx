import type { Category } from '../../types/store'
import { LayoutGrid } from 'lucide-react'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategoryId: string | null
  onSelectCategory: (id: string | null) => void
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="relative">
      {/* Scrollable pill container */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none snap-x touch-pan-x">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-2xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-2 border ${
            selectedCategoryId === null
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30 scale-[1.02]'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/80 shadow-xs'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Todos</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/80 shadow-xs'
              }`}
            >
              {cat.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
