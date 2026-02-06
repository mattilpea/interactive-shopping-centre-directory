import { useState } from "react"

type Marker = {
  id: string
  label: string
  color: string
  x: string
  y: string
  category: string
}

type Props = {
  title: string
  floorLabel: string
  level1: string
  level2: string
  placeholder: string
  zoneParking: string
  zoneBanks: string
  zoneShopping: string
  zoneFood: string
  legendYouAreHere: string
  legendFireExit: string
  legendAccessible: string
  legendSelected: string
  zoomOut: string
  zoomIn: string
  markers: Marker[]
  selectedCategory: string
  selectedMarkerId: string | null
  onSelectMarker: (id: string) => void
  showList: boolean
  onToggleList: () => void
  listTitle: string
}

export default function MapPanel({
  title,
  floorLabel,
  level1,
  level2,
  placeholder,
  zoneParking,
  zoneBanks,
  zoneShopping,
  zoneFood,
  legendYouAreHere,
  legendFireExit,
  legendAccessible,
  legendSelected,
  zoomOut,
  zoomIn,
  markers,
  selectedCategory,
  selectedMarkerId,
  onSelectMarker,
  showList,
  onToggleList,
  listTitle,
}: Props) {
  const [level, setLevel] = useState<1 | 2>(2)
  const [zoom, setZoom] = useState(1)
  const [showLegend, setShowLegend] = useState(false)

  const filteredMarkers = markers.filter((m) => m.category === selectedCategory)

  const zoomInClick = () =>
    setZoom((z) => Math.min(1.6, Math.round((z + 0.1) * 100) / 100))
  const zoomOutClick = () =>
    setZoom((z) => Math.max(0.6, Math.round((z - 0.1) * 100) / 100))

  return (
    <div className="h-full rounded-2xl shadow bg-white overflow-hidden flex flex-col">
      {/* Header (fixed) */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow">
          <span className="text-sm font-semibold tracking-wider">MAP</span>
        </div>
        <div>
          <div className="text-xl font-semibold">{title}</div>
          <div className="text-slate-300">
            {floorLabel} {level}
          </div>
        </div>
      </div>

      {/* Level tabs (fixed) */}
      <div className="grid grid-cols-2 bg-slate-100 border-b border-slate-200">
        <button
          className={`py-3 font-semibold ${
            level === 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
          } hover:bg-blue-600 hover:text-white transition`}
          onClick={() => setLevel(1)}
        >
          {level1}
        </button>
        <button
          className={`py-3 font-semibold ${
            level === 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
          } hover:bg-blue-600 hover:text-white transition`}
          onClick={() => setLevel(2)}
        >
          {level2}
        </button>
      </div>

      {/* Content area (flex) */}
      <div className="flex-1 p-6 2xl:p-8 overflow-hidden flex flex-col">
        {/* Map area becomes flexible height */}
        <div className="flex-1 rounded-2xl border border-slate-200 shadow-sm bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-6 rounded-2xl bg-white border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.12)] overflow-hidden">
            <div
              className="absolute inset-0 origin-center transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:36px_36px]" />

            {/* Zones */}
              <div className="absolute left-[7%] top-[8%] w-[36%] h-[32%] rounded-2xl border border-blue-300 bg-blue-100/90 text-blue-900 font-semibold flex items-center justify-center">
                {zoneParking}
              </div>
              <div className="absolute right-[7%] top-[10%] w-[34%] h-[28%] rounded-2xl border border-emerald-300 bg-emerald-100/90 text-emerald-900 font-semibold flex items-center justify-center">
                {zoneBanks}
              </div>
              <div className="absolute left-[14%] bottom-[12%] w-[48%] h-[30%] rounded-2xl border border-amber-300 bg-amber-100/90 text-amber-900 font-semibold flex items-center justify-center">
                {zoneShopping}
              </div>
              <div className="absolute right-[10%] bottom-[12%] w-[28%] h-[30%] rounded-2xl border border-orange-300 bg-orange-100/90 text-orange-900 font-semibold flex items-center justify-center">
                {zoneFood}
              </div>

            {/* Markers */}
              {markers.map((m) => {
                const isSelected = m.id === selectedMarkerId
                return (
                <div
                  key={m.label}
                  className="absolute group"
                  style={{ left: m.x, top: m.y }}
                  onClick={() => onSelectMarker(m.id)}
                >
                  <span
                    className={[
                      "block w-5 h-5 rounded-full bg-white shadow-[0_6px_16px_rgba(15,23,42,0.2)] border-[4px] transition",
                      isSelected ? "scale-110 shadow-[0_0_0_6px_rgba(59,130,246,0.2)]" : "",
                    ].join(" ")}
                    style={{ borderColor: m.color }}
                  />
                  <span
                    className={[
                      "pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 transition text-xs font-semibold text-slate-700 bg-white/95 px-2 py-1 rounded-full border border-slate-200 shadow",
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                  >
                    {m.label}
                  </span>
                </div>
                )
              })}

            {/* Static markers */}
              <div className="absolute left-[48%] top-[46%] w-6 h-6 rounded-full bg-blue-600 shadow-[0_10px_20px_rgba(37,99,235,0.35)] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div className="absolute left-[53%] top-[50%] text-[11px] font-bold bg-blue-600 text-white px-3 py-1 rounded-full shadow">
                {legendYouAreHere}
              </div>
              <div className="absolute right-[18%] bottom-[22%] w-5 h-5 rounded-full bg-white border-[4px] border-red-600 shadow" />
              <div className="absolute left-[16%] bottom-[26%] w-5 h-5 rounded-full bg-white border-[4px] border-red-600 shadow" />
            </div>
          </div>

          <div className="absolute right-6 top-6 text-xs text-slate-500 bg-white/90 px-3 py-2 rounded-full border border-slate-200 shadow">
            {placeholder}
          </div>

          {/* Legend toggle + panel */}
          <div className="absolute left-6 top-6 flex items-start gap-2">
            <button
              type="button"
              onClick={() => setShowLegend((v) => !v)}
              className="h-9 px-3 rounded-full bg-white/95 border border-slate-200 shadow flex items-center gap-2 text-xs font-semibold text-slate-700 hover:bg-white"
              aria-pressed={showLegend}
              aria-label="Toggle map legend"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Key
            </button>

            {showLegend && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </span>
                  <span>{legendYouAreHere}</span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-white border-[4px] border-red-600" />
                  <span>{legendFireExit}</span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-white border-[4px] border-green-600" />
                  <span>{legendAccessible}</span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-white border-[4px] border-orange-500" />
                  <span>{legendSelected}</span>
                </div>
              </div>
            )}
          </div>

          {/* Location list toggle + panel */}
          <div className="absolute right-6 bottom-6 flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={onToggleList}
              className="h-9 px-3 rounded-full bg-white/95 border border-slate-200 shadow flex items-center gap-2 text-xs font-semibold text-slate-700 hover:bg-white"
              aria-pressed={showList}
              aria-label="Toggle location list"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              List
            </button>

            {showList && (
              <div className="w-56 bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
                <div className="text-sm font-semibold text-slate-900">
                  {listTitle}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {selectedCategory}
                </div>
                <div className="mt-3 space-y-2">
                  {filteredMarkers.map((m) => {
                    const isSelected = m.id === selectedMarkerId
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onSelectMarker(m.id)}
                        className={[
                          "w-full text-left text-sm px-3 py-2 rounded-xl border transition",
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700",
                        ].join(" ")}
                      >
                        {m.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zoom controls pinned at bottom */}
        <div className="pt-6 flex items-center justify-center gap-3">
          <button
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 flex items-center gap-2"
            onClick={zoomOutClick}
            aria-label={zoomOut}
          >
            <span className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-xs">-</span>
            {zoomOut}
          </button>
          <div className="px-6 py-3 rounded-xl border border-slate-200 bg-white shadow-sm font-semibold text-slate-700">
            {Math.round(zoom * 100)}%
          </div>
          <button
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 flex items-center gap-2"
            onClick={zoomInClick}
            aria-label={zoomIn}
          >
            <span className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-xs">+</span>
            {zoomIn}
          </button>
        </div>
      </div>
    </div>
  )
}
