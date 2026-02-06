type Props = {
  label: string
  icon: string
  onClick?: () => void
  selected?: boolean
}

export default function CategoryCard({
  label,
  icon,
  onClick,
  selected,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "group w-full rounded-2xl bg-white border text-left",
        "transition-all duration-200",
        "shadow-sm",
        "hover:-translate-y-1 hover:shadow-lg",
        // ✅ blue highlight without layout overflow
        "hover:border-blue-500 hover:shadow-[0_0_0_4px_rgba(59,130,246,0.25)]",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300",
        selected
          ? "border-blue-600 shadow-[0_0_0_4px_rgba(59,130,246,0.25)]"
          : "border-slate-200",
      ].join(" ")}
    >
      <div className="p-5 sm:p-6 flex flex-col items-center justify-center gap-4">
        {/* Icon container */}
        <div
          className={[
            "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl",
            "bg-blue-600 flex items-center justify-center",
            "transition-transform duration-200",
            // 🔥 stronger but safe hover pop
            "group-hover:scale-105",
          ].join(" ")}
        >
          <span className="text-3xl sm:text-4xl 2xl:text-5xl leading-none text-white">
            {icon}
          </span>
        </div>

        {/* Label */}
        <div className="text-center text-base sm:text-lg font-semibold text-slate-900">
          {label}
        </div>
      </div>
    </button>
  )
}
