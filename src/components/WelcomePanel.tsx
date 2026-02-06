import { useState } from "react"

type Props = {
  title: string
  subtitle: string
  helpTitle: string
  helpSteps: readonly string[]
  helpButtonLabel: string
  helpPanelTitle: string
  helpSections: readonly {
    title: string
    body?: string
    items?: readonly string[]
  }[]
}

export default function WelcomePanel({
  title,
  subtitle,
  helpTitle,
  helpSteps,
  helpButtonLabel,
  helpPanelTitle,
  helpSections,
}: Props) {
  const [showHelp, setShowHelp] = useState(false)
  const [showHelpCard, setShowHelpCard] = useState(false)

  return (
    <div className="rounded-2xl shadow overflow-hidden bg-white">
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white
                      px-6 py-6 md:px-8 md:py-10">
        <h2 className="font-bold leading-none text-4xl md:text-5xl">{title}</h2>
        <p className="mt-2 text-white/90 text-lg md:text-xl">{subtitle}</p>
      </div>

      <div className="p-6 md:p-8">
        {showHelpCard ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 text-slate-900 font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm">
                  i
                </span>
                <span>{helpTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHelp((v) => !v)}
                  className="h-9 px-4 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-100"
                  aria-pressed={showHelp}
                >
                  {helpButtonLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setShowHelpCard(false)}
                  className="h-9 px-4 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-100"
                  aria-label="Hide help"
                >
                  Hide
                </button>
              </div>
            </div>
            <ol className="mt-4 space-y-2 text-slate-700">
              {helpSteps.map((step, index) => (
                <li key={step}>
                  <span className="font-semibold mr-2">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm">
                i
              </span>
              <span>{helpTitle}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpCard(true)}
              className="h-9 px-4 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-100"
              aria-label="Show help"
            >
              Show
            </button>
          </div>
        )}

        {showHelp && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="text-lg font-semibold text-slate-900">
              {helpPanelTitle}
            </div>
            <div className="mt-4 max-h-56 overflow-y-auto pr-2 space-y-5 text-slate-700">
              {helpSections.map((section) => (
                <div key={section.title}>
                  <div className="font-semibold text-slate-900">
                    {section.title}
                  </div>
                  {section.body && (
                    <p className="mt-2 text-sm leading-relaxed">
                      {section.body}
                    </p>
                  )}
                  {section.items && (
                    <ul className="mt-2 space-y-2 text-sm">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
