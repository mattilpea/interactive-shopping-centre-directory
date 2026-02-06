import CategoryCard from "./CategoryCard"

type Category = { label: string; icon: string }

type Props = {
  categories: readonly Category[]
  onSelectCategory?: (label: string) => void
}

export default function CategoryGrid({ categories, onSelectCategory }: Props) {
  return (
    <div className="h-full rounded-2xl bg-slate-100/50 border border-slate-200 shadow p-4 overflow-hidden">
      <div className="h-full overflow-y-auto pr-2 p-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.label}
              label={c.label}
              icon={c.icon}
              onClick={() => onSelectCategory?.(c.label)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
