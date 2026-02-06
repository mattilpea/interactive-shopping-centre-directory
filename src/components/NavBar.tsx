type Props = {
  largeText: boolean
  onToggleLargeText: () => void
  audioOn: boolean
  onToggleAudio: () => void
  language: string
  onChangeLanguage: (lang: string) => void
  languageLabel: string
  title: string
  subtitle: string
  languages: { code: string; label: string }[]
}

export default function NavBar({
  largeText,
  onToggleLargeText,
  audioOn,
  onToggleAudio,
  language,
  onChangeLanguage,
  languageLabel,
  title,
  subtitle,
  languages,
}: Props) {
  return (
    <header className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white shadow-md">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow shrink-0">
            <span className="text-xl sm:text-2xl">🗺️</span>
          </div>

          <div className="leading-tight min-w-0">
            {/* Truncates on small screens */}
            <div className="text-lg sm:text-2xl font-semibold truncate">
              {title}
            </div>

            {/* Hide subtitle on very small screens */}
            <div className="text-slate-300 hidden sm:block">
              {subtitle}
            </div>
          </div>
        </div>

        {/* Right controls */}
        <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleLargeText}
            aria-label="Toggle larger text"
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-slate-700/60 hover:bg-slate-600/60 transition ${
              largeText ? "ring-2 ring-blue-400" : ""
            }`}
          >
            <span className="text-lg sm:text-xl font-semibold">T</span>
          </button>

          <button
            type="button"
            onClick={onToggleAudio}
            aria-label="Toggle audio feedback"
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition ${
              audioOn
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-slate-700/60 hover:bg-slate-600/60"
            }`}
          >
            <span className="text-lg sm:text-xl">{audioOn ? "🔊" : "🔈"}</span>
          </button>

          <label className="h-12 sm:h-14 px-3 sm:px-4 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 transition flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">🌐</span>
            <span className="text-sm sm:text-base text-slate-200 hidden sm:inline">
              {languageLabel}
            </span>
            <select
              className="bg-transparent text-white font-semibold outline-none"
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value)}
              aria-label={languageLabel}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-slate-900">
                  {lang.label}
                </option>
              ))}
            </select>
          </label>
        </nav>
      </div>
    </header>
  )
}
