import { useState } from "react"

type Offer = {
  title: string
  subtitle: string
}

type Props = {
  header: string
  offers: Offer[]
  promotionsTitle: string
  promotions: string[]
}

export default function PromoPanel({
  header,
  offers,
  promotionsTitle,
  promotions,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = offers[activeIndex] ?? offers[0]

  return (
    <div className="rounded-2xl overflow-hidden shadow bg-white">
      {/* Promo header + banner */}
      <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl">✨</span>
          <span>{header}</span>
        </div>
      </div>

      <div className="bg-gradient-to-b from-fuchsia-500/70 via-purple-600/70 to-slate-900 px-6 py-12 text-white">
        <h2 className="text-3xl font-bold">{active.title}</h2>
        <p className="mt-2 text-white/90">{active.subtitle}</p>

        <div className="mt-8 flex items-center gap-2 justify-center">
          {offers.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Offer ${i + 1}`}
              className={[
                "h-2 rounded-full transition-all",
                i === activeIndex ? "w-10 bg-white" : "w-2 bg-white/40",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* Promotions list */}
      <div className="p-6">
        <h3 className="font-semibold text-slate-900">{promotionsTitle}</h3>

        <ul className="mt-4 space-y-3 text-slate-700">
          {promotions.map((item, index) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className={[
                  "mt-2 w-2 h-2 rounded-full",
                  index === 0
                    ? "bg-pink-600"
                    : index === 1
                    ? "bg-orange-500"
                    : "bg-blue-600",
                ].join(" ")}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
