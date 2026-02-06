import { useEffect, useMemo, useState } from "react"
import NavBar from "./components/NavBar"
import PromoPanel from "./components/PromoPanel"
import WelcomePanel from "./components/WelcomePanel"
import CategoryGrid from "./components/CategoryGrid"
import MapPanel from "./components/MapPanel"
import { useAudioFeedback } from "./hooks/useAudioFeedback"

type MobileTab = "explore" | "map" | "offers"
type Language = "EN" | "ES" | "FR" | "DE" | "ZH" | "AR"

export default function App() {
  const [largeText, setLargeText] = useState(false)
  const [audioOn, setAudioOn] = useState(true)
  const [language, setLanguage] = useState<Language>("EN")
  const [mobileTab, setMobileTab] = useState<MobileTab>("explore")
  const [selectedCategory, setSelectedCategory] = useState<string>("Parking")
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
  const [showLocationList, setShowLocationList] = useState(true)

  // Track 2XL screens (Tailwind 2xl = min-width 1536px)
  const [is2k, setIs2k] = useState(false)
  const [isWide, setIsWide] = useState(false)

  // Audio hook (uses /public/sounds/click.ogg)
  const { playClick } = useAudioFeedback({ enabled: audioOn, volume: 0.35 })

  useEffect(() => {
    const mq2k = window.matchMedia("(min-width: 2560px)")
    const mqWide = window.matchMedia("(min-width: 1400px)")
    const update2k = () => setIs2k(mq2k.matches)
    const updateWide = () => setIsWide(mqWide.matches)
    update2k()
    updateWide()

    // Safari fallback: addListener/removeListener
    if (mq2k.addEventListener) mq2k.addEventListener("change", update2k)
    else mq2k.addListener(update2k)
    if (mqWide.addEventListener) mqWide.addEventListener("change", updateWide)
    else mqWide.addListener(updateWide)

    return () => {
      if (mq2k.removeEventListener) mq2k.removeEventListener("change", update2k)
      else mq2k.removeListener(update2k)
      if (mqWide.removeEventListener) mqWide.removeEventListener("change", updateWide)
      else mqWide.removeListener(updateWide)
    }
  }, [])

  // ✅ Scale the ROOT font-size (rem) based on screen size + largeText toggle
  // - normal: 16px
  // - 2K+: 20px (bigger for 2560x1440)
  // - largeText: +12.5% on top
  const rootFontSizePx = useMemo(() => {
    const base = is2k ? 20 : isWide ? 14 : 16
    const scaled = largeText ? Math.round(base * 1.125) : base
    return `${scaled}px`
  }, [is2k, isWide, largeText])

  useEffect(() => {
    document.documentElement.style.fontSize = rootFontSizePx
    localStorage.setItem("largeText", JSON.stringify(largeText))

    return () => {
      document.documentElement.style.fontSize = "16px"
    }
  }, [rootFontSizePx, largeText])

  // optional: load saved preference once
  useEffect(() => {
    const saved = localStorage.getItem("largeText")
    if (saved) setLargeText(JSON.parse(saved))
  }, [])

  // language preference
  useEffect(() => {
    const saved = localStorage.getItem("language")
    if (saved) setLanguage(saved as Language)
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // audio preference
  useEffect(() => {
    const saved = localStorage.getItem("audioOn")
    if (saved !== null) setAudioOn(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("audioOn", JSON.stringify(audioOn))
  }, [audioOn])

  /**
   * ✅ Global click sound:
   * Plays on any click on a <button> or anything with role="button".
   * Also plays when using keyboard activation (Enter/Space).
   */
  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (!audioOn) return
      const target = e.target as HTMLElement | null
      if (!target) return

      // Find nearest clickable button-like element
      const btn = target.closest('button, [role="button"]') as HTMLElement | null
      if (!btn) return

      // Don’t play if disabled
      const isDisabled =
        (btn as HTMLButtonElement).disabled ||
        btn.getAttribute("aria-disabled") === "true"
      if (isDisabled) return

      playClick()
    }

    const onKeyDownCapture = (e: KeyboardEvent) => {
      if (!audioOn) return
      if (e.key !== "Enter" && e.key !== " ") return

      const target = e.target as HTMLElement | null
      if (!target) return

      const btn = target.closest('button, [role="button"]') as HTMLElement | null
      if (!btn) return

      const isDisabled =
        (btn as HTMLButtonElement).disabled ||
        btn.getAttribute("aria-disabled") === "true"
      if (isDisabled) return

      playClick()
    }

    // Capture phase means we catch it even if components stopPropagation later
    document.addEventListener("click", onClickCapture, true)
    document.addEventListener("keydown", onKeyDownCapture, true)

    return () => {
      document.removeEventListener("click", onClickCapture, true)
      document.removeEventListener("keydown", onKeyDownCapture, true)
    }
  }, [audioOn, playClick])

  const languages = [
    { code: "EN", label: "English" },
    { code: "ES", label: "Spanish" },
    { code: "FR", label: "French" },
    { code: "DE", label: "German" },
    { code: "ZH", label: "Chinese" },
    { code: "AR", label: "Arabic" },
  ]

  const baseHelpSections = [
    {
      title: "Search and Filters",
      body:
        "Use the search bar to look up types or names of shops/facilities. Matching results will appear below the search bar. You can also use the row of buttons at the top of the page to filter what you are looking for.",
    },
    {
      title: "Contact us",
      body:
        "There are all kinds of ways to get in touch - give us a call, send us an email or drop us a line.",
    },
    {
      title: "Call us",
      items: [
        "Reception: 0117 915 5555",
        "Accessibility: 0117 915 5326",
        "Information Desk: 0117 915 5335",
      ],
    },
    { title: "Email us", items: ["contact@mallcribbs.com"] },
  ]

  const copy = {
    EN: {
      navTitle: "Shopping Centre",
      navSubtitle: "Interactive Directory",
      languageLabel: "Language",
      tabs: { explore: "Explore", map: "Map", offers: "Offers" },
      welcomeTitle: "Welcome",
      welcomeSubtitle: "Select a category to begin",
      helpTitle: "How to Use",
      helpSteps: [
        "Touch any category button on the home screen (Parking, Banks, Shopping, Food, etc.)",
        "Browse the list of locations in that category",
        "Touch a location to see it highlighted",
      ],
      helpButtonLabel: "Help",
      helpPanelTitle: "How to navigate through this Kiosk",
      helpSections: baseHelpSections,
      promoHeader: "Special Offers",
      promoOffers: [
        { title: "Family Day", subtitle: "Kids activities every Saturday" },
        { title: "Tech Week", subtitle: "Up to 30% off select gadgets" },
        { title: "Style Edit", subtitle: "New season drops in Fashion Hub" },
        { title: "Food Fest", subtitle: "Limited menus and pop-up chefs" },
      ],
      promotionsTitle: "Today's Promotions",
      promotions: [
        "50% off at Fashion Hub",
        "BOGO at Food Court",
        "Tech World clearance sale",
      ],
      categories: [
        { label: "Parking", icon: "🚗" },
        { label: "Banks", icon: "🏦" },
        { label: "Shopping", icon: "🛍️" },
        { label: "Food", icon: "🍴" },
        { label: "Search", icon: "🔎" },
        { label: "Special Offers", icon: "🏷️" },
        { label: "Disabled Access", icon: "♿" },
        { label: "Centre Info", icon: "ℹ️" },
        { label: "Help", icon: "❓" },
      ],
      map: {
        title: "Interactive Map",
        floorLabel: "Floor",
        level1: "Level 1",
        level2: "Level 2",
        placeholder: "Map / Blueprint Placeholder",
        zoneParking: "Parking",
        zoneBanks: "Banks",
        zoneShopping: "Shopping",
        zoneFood: "Food",
        legendYouAreHere: "You Are Here",
        legendFireExit: "Fire Exit",
        legendAccessible: "Accessible",
        legendSelected: "Selected",
        zoomOut: "🔍 Out",
        zoomIn: "🔍 In",
      },
    },
    ES: {
      navTitle: "Centro Comercial",
      navSubtitle: "Directorio Interactivo",
      languageLabel: "Idioma",
      tabs: { explore: "Explorar", map: "Mapa", offers: "Ofertas" },
      welcomeTitle: "Bienvenido",
      welcomeSubtitle: "Seleccione una categoria para empezar",
      helpTitle: "Como Usar",
      helpSteps: [
        "Toque cualquier categoria en la pantalla de inicio",
        "Explore la lista de ubicaciones en esa categoria",
        "Toque una ubicacion para resaltarla",
      ],
      helpButtonLabel: "Ayuda",
      helpPanelTitle: "How to navigate through this Kiosk",
      helpSections: baseHelpSections,
      promoHeader: "Ofertas Especiales",
      promoOffers: [
        { title: "Dia Familiar", subtitle: "Actividades infantiles cada sabado" },
        { title: "Semana Tech", subtitle: "Hasta 30% en tecnologia" },
        { title: "Estilo Nuevo", subtitle: "Nuevas colecciones en Fashion Hub" },
        { title: "Festival de Comida", subtitle: "Menus limitados y chefs invitados" },
      ],
      promotionsTitle: "Promociones de Hoy",
      promotions: [
        "50% de descuento en Fashion Hub",
        "2x1 en Food Court",
        "Liquidacion en Tech World",
      ],
      categories: [
        { label: "Estacionamiento", icon: "🚗" },
        { label: "Bancos", icon: "🏦" },
        { label: "Compras", icon: "🛍️" },
        { label: "Comida", icon: "🍴" },
        { label: "Buscar", icon: "🔎" },
        { label: "Ofertas Especiales", icon: "🏷️" },
        { label: "Acceso Discapacidad", icon: "♿" },
        { label: "Informacion del Centro", icon: "ℹ️" },
        { label: "Ayuda", icon: "❓" },
      ],
      map: {
        title: "Mapa Interactivo",
        floorLabel: "Piso",
        level1: "Nivel 1",
        level2: "Nivel 2",
        placeholder: "Mapa / Plano",
        zoneParking: "Estacionamiento",
        zoneBanks: "Bancos",
        zoneShopping: "Compras",
        zoneFood: "Comida",
        legendYouAreHere: "Usted esta aqui",
        legendFireExit: "Salida de Emergencia",
        legendAccessible: "Accesible",
        legendSelected: "Seleccionado",
        zoomOut: "🔍 Menos",
        zoomIn: "🔍 Mas",
      },
    },
    FR: {
      navTitle: "Centre Commercial",
      navSubtitle: "Annuaire Interactif",
      languageLabel: "Langue",
      tabs: { explore: "Explorer", map: "Plan", offers: "Offres" },
      welcomeTitle: "Bienvenue",
      welcomeSubtitle: "Choisissez une categorie pour commencer",
      helpTitle: "Mode d'emploi",
      helpSteps: [
        "Touchez une categorie sur l'ecran d'accueil",
        "Parcourez la liste des lieux de cette categorie",
        "Touchez un lieu pour le mettre en evidence",
      ],
      helpButtonLabel: "Aide",
      helpPanelTitle: "How to navigate through this Kiosk",
      helpSections: baseHelpSections,
      promoHeader: "Offres Speciales",
      promoOffers: [
        { title: "Journee Famille", subtitle: "Activites pour enfants chaque samedi" },
        { title: "Semaine Tech", subtitle: "Jusqu'a 30% sur la tech" },
        { title: "Nouvelle Mode", subtitle: "Nouvelles collections Fashion Hub" },
        { title: "Festival Gourmand", subtitle: "Menus limites et chefs invites" },
      ],
      promotionsTitle: "Promotions du Jour",
      promotions: [
        "50% de reduction chez Fashion Hub",
        "1+1 au Food Court",
        "Liquidation chez Tech World",
      ],
      categories: [
        { label: "Parking", icon: "🚗" },
        { label: "Banques", icon: "🏦" },
        { label: "Shopping", icon: "🛍️" },
        { label: "Restauration", icon: "🍴" },
        { label: "Recherche", icon: "🔎" },
        { label: "Offres Speciales", icon: "🏷️" },
        { label: "Acces Handicape", icon: "♿" },
        { label: "Infos Centre", icon: "ℹ️" },
        { label: "Aide", icon: "❓" },
      ],
      map: {
        title: "Plan Interactif",
        floorLabel: "Etage",
        level1: "Niveau 1",
        level2: "Niveau 2",
        placeholder: "Plan / Schema",
        zoneParking: "Parking",
        zoneBanks: "Banques",
        zoneShopping: "Shopping",
        zoneFood: "Restauration",
        legendYouAreHere: "Vous etes ici",
        legendFireExit: "Sortie de Secours",
        legendAccessible: "Accessible",
        legendSelected: "Selectionne",
        zoomOut: "🔍 Moins",
        zoomIn: "🔍 Plus",
      },
    },
    DE: {
      navTitle: "Einkaufszentrum",
      navSubtitle: "Interaktives Verzeichnis",
      languageLabel: "Sprache",
      tabs: { explore: "Entdecken", map: "Karte", offers: "Angebote" },
      welcomeTitle: "Willkommen",
      welcomeSubtitle: "Wahlen Sie eine Kategorie zum Start",
      helpTitle: "Hilfe",
      helpSteps: [
        "Tippen Sie eine Kategorie auf dem Startbildschirm",
        "Sehen Sie die Liste der Orte in dieser Kategorie",
        "Tippen Sie einen Ort zum Hervorheben",
      ],
      helpButtonLabel: "Hilfe",
      helpPanelTitle: "How to navigate through this Kiosk",
      helpSections: baseHelpSections,
      promoHeader: "Sonderangebote",
      promoOffers: [
        { title: "Familientag", subtitle: "Kinderaktionen jeden Samstag" },
        { title: "Tech Woche", subtitle: "Bis zu 30% auf Technik" },
        { title: "Neue Styles", subtitle: "Neue Kollektionen im Fashion Hub" },
        { title: "Food Festival", subtitle: "Limited Menus und Gastkoeche" },
      ],
      promotionsTitle: "Heutige Angebote",
      promotions: [
        "50% Rabatt bei Fashion Hub",
        "1+1 im Food Court",
        "Ausverkauf bei Tech World",
      ],
      categories: [
        { label: "Parken", icon: "🚗" },
        { label: "Banken", icon: "🏦" },
        { label: "Einkaufen", icon: "🛍️" },
        { label: "Essen", icon: "🍴" },
        { label: "Suche", icon: "🔎" },
        { label: "Sonderangebote", icon: "🏷️" },
        { label: "Barrierefrei", icon: "♿" },
        { label: "Center Info", icon: "ℹ️" },
        { label: "Hilfe", icon: "❓" },
      ],
      map: {
        title: "Interaktive Karte",
        floorLabel: "Ebene",
        level1: "Ebene 1",
        level2: "Ebene 2",
        placeholder: "Karte / Grundriss",
        zoneParking: "Parken",
        zoneBanks: "Banken",
        zoneShopping: "Einkaufen",
        zoneFood: "Essen",
        legendYouAreHere: "Sie sind hier",
        legendFireExit: "Notausgang",
        legendAccessible: "Barrierefrei",
        legendSelected: "Ausgewahlt",
        zoomOut: "🔍 Weniger",
        zoomIn: "🔍 Mehr",
      },
    },
    ZH: {
      navTitle: "购物中心",
      navSubtitle: "互动导览",
      languageLabel: "语言",
      tabs: { explore: "探索", map: "地图", offers: "优惠" },
      welcomeTitle: "欢迎",
      welcomeSubtitle: "请选择类别开始",
      helpTitle: "使用说明",
      helpSteps: ["选择首页的分类", "浏览该分类的地点列表", "点击地点以高亮显示"],
      helpButtonLabel: "帮助",
      helpPanelTitle: "How to navigate through this Kiosk",
      helpSections: baseHelpSections,
      promoHeader: "特别优惠",
      promoOffers: [
        { title: "家庭日", subtitle: "每周六儿童活动" },
        { title: "科技周", subtitle: "精选数码最高七折" },
        { title: "时尚上新", subtitle: "Fashion Hub 新季上架" },
        { title: "美食节", subtitle: "限定菜单与快闪主厨" },
      ],
      promotionsTitle: "今日促销",
      promotions: ["时尚馆五折", "美食广场买一送一", "科技世界清仓"],
      categories: [
        { label: "停车", icon: "🚗" },
        { label: "银行", icon: "🏦" },
        { label: "购物", icon: "🛍️" },
        { label: "餐饮", icon: "🍴" },
        { label: "搜索", icon: "🔎" },
        { label: "特别优惠", icon: "🏷️" },
        { label: "无障碍", icon: "♿" },
        { label: "中心信息", icon: "ℹ️" },
        { label: "帮助", icon: "❓" },
      ],
      map: {
        title: "互动地图",
        floorLabel: "楼层",
        level1: "一层",
        level2: "二层",
        placeholder: "地图 / 平面图",
        zoneParking: "停车",
        zoneBanks: "银行",
        zoneShopping: "购物",
        zoneFood: "餐饮",
        legendYouAreHere: "您在这里",
        legendFireExit: "安全出口",
        legendAccessible: "无障碍",
        legendSelected: "已选择",
        zoomOut: "🔍 缩小",
        zoomIn: "🔍 放大",
      },
    },
    AR: {
      navTitle: "مركز التسوق",
      navSubtitle: "دليل تفاعلي",
      languageLabel: "اللغة",
      tabs: { explore: "استكشاف", map: "الخريطة", offers: "عروض" },
      welcomeTitle: "اهلا وسهلا",
      welcomeSubtitle: "اختر فئة للبدء",
      helpTitle: "طريقة الاستخدام",
      helpSteps: ["اختر فئة من الصفحة الرئيسية", "تصفح قائمة المواقع للفئة", "اضغط على موقع لتمييزه"],
      helpButtonLabel: "مساعدة",
      helpPanelTitle: "How to navigate through this Kiosk",
      helpSections: baseHelpSections,
      promoHeader: "عروض خاصة",
      promoOffers: [
        { title: "يوم العائلة", subtitle: "انشطة الاطفال كل سبت" },
        { title: "اسبوع التقنية", subtitle: "خصومات حتى 30% على التقنية" },
        { title: "ستايل جديد", subtitle: "تشكيلات جديدة في Fashion Hub" },
        { title: "مهرجان الطعام", subtitle: "قوائم محدودة وطهاة ضيوف" },
      ],
      promotionsTitle: "عروض اليوم",
      promotions: ["خصم 50% في Fashion Hub", "اشتر واحد واحصل على واحد", "تصفية في Tech World"],
      categories: [
        { label: "موقف سيارات", icon: "🚗" },
        { label: "بنوك", icon: "🏦" },
        { label: "تسوق", icon: "🛍️" },
        { label: "طعام", icon: "🍴" },
        { label: "بحث", icon: "🔎" },
        { label: "عروض خاصة", icon: "🏷️" },
        { label: "دخول لذوي الاعاقة", icon: "♿" },
        { label: "معلومات المركز", icon: "ℹ️" },
        { label: "مساعدة", icon: "❓" },
      ],
      map: {
        title: "خريطة تفاعلية",
        floorLabel: "الطابق",
        level1: "المستوى 1",
        level2: "المستوى 2",
        placeholder: "خريطة / مخطط",
        zoneParking: "موقف سيارات",
        zoneBanks: "بنوك",
        zoneShopping: "تسوق",
        zoneFood: "طعام",
        legendYouAreHere: "انت هنا",
        legendFireExit: "مخرج طوارئ",
        legendAccessible: "مناسب",
        legendSelected: "محدد",
        zoomOut: "🔍 تصغير",
        zoomIn: "🔍 تكبير",
      },
    },
  } as const

  const t = copy[language]
  const categoryLocations = [
    {
      category: t.categories[0].label,
      color: "#2563eb",
      items: [
        { id: "parking-1", label: `${t.categories[0].label} - L1`, x: "18%", y: "22%" },
        { id: "parking-2", label: `${t.categories[0].label} - L2`, x: "26%", y: "28%" },
        { id: "parking-3", label: `${t.categories[0].label} - East`, x: "14%", y: "34%" },
        { id: "parking-4", label: `${t.categories[0].label} - West`, x: "30%", y: "20%" },
      ],
    },
    {
      category: t.categories[1].label,
      color: "#059669",
      items: [
        { id: "banks-1", label: `${t.categories[1].label} - Central`, x: "70%", y: "20%" },
        { id: "banks-2", label: `${t.categories[1].label} - South`, x: "64%", y: "30%" },
      ],
    },
    {
      category: t.categories[2].label,
      color: "#d97706",
      items: [
        { id: "shopping-1", label: `${t.categories[2].label} - Main`, x: "36%", y: "64%" },
        { id: "shopping-2", label: `${t.categories[2].label} - North`, x: "46%", y: "58%" },
        { id: "shopping-3", label: `${t.categories[2].label} - Outlet`, x: "54%", y: "66%" },
      ],
    },
    {
      category: t.categories[3].label,
      color: "#ea580c",
      items: [
        { id: "food-1", label: `${t.categories[3].label} - Court`, x: "72%", y: "64%" },
        { id: "food-2", label: `${t.categories[3].label} - Cafe`, x: "66%", y: "70%" },
      ],
    },
    {
      category: t.categories[4].label,
      color: "#0ea5e9",
      items: [
        { id: "search-1", label: `${t.categories[4].label} - Info Desk`, x: "48%", y: "36%" },
      ],
    },
    {
      category: t.categories[5].label,
      color: "#9333ea",
      items: [
        { id: "offers-1", label: `${t.categories[5].label} - Pop Up`, x: "58%", y: "40%" },
      ],
    },
    {
      category: t.categories[6].label,
      color: "#16a34a",
      items: [
        { id: "access-1", label: `${t.categories[6].label} - Ramp`, x: "22%", y: "46%" },
        { id: "access-2", label: `${t.categories[6].label} - Lift`, x: "28%", y: "52%" },
      ],
    },
    {
      category: t.categories[7].label,
      color: "#64748b",
      items: [
        { id: "info-1", label: `${t.categories[7].label} - Lobby`, x: "40%", y: "48%" },
      ],
    },
    {
      category: t.categories[8].label,
      color: "#e11d48",
      items: [
        { id: "help-1", label: `${t.categories[8].label} - Desk`, x: "76%", y: "46%" },
      ],
    },
  ]

  const mapMarkers = categoryLocations.flatMap((cat) =>
    cat.items.map((item) => ({
      id: item.id,
      label: item.label,
      color: cat.color,
      x: item.x,
      y: item.y,
      category: cat.category,
    }))
  )

  useEffect(() => {
    if (!selectedMarkerId) {
      const first = mapMarkers.find((m) => m.category === selectedCategory)
      if (first) setSelectedMarkerId(first.id)
    }
  }, [selectedCategory, mapMarkers, selectedMarkerId])

  return (
    <div className="h-screen bg-slate-100 flex flex-col">
      <NavBar
        largeText={largeText}
        onToggleLargeText={() => setLargeText((v) => !v)}
        audioOn={audioOn}
        onToggleAudio={() => setAudioOn((v) => !v)}
        language={language}
        onChangeLanguage={(lang) => setLanguage(lang as Language)}
        languageLabel={t.languageLabel}
        title={t.navTitle}
        subtitle={t.navSubtitle}
        languages={languages}
      />

      {/* Mobile tab bar */}
      <div className="lg:hidden px-4 pt-4">
        <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <button
            className={`py-3 font-semibold ${
              mobileTab === "explore" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setMobileTab("explore")}
          >
            {t.tabs.explore}
          </button>
          <button
            className={`py-3 font-semibold ${
              mobileTab === "map" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setMobileTab("map")}
          >
            {t.tabs.map}
          </button>
          <button
            className={`py-3 font-semibold ${
              mobileTab === "offers" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setMobileTab("offers")}
          >
            {t.tabs.offers}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        <div
          className="
            h-full mx-auto w-full
            max-w-[1400px] 2xl:max-w-[2300px]
            px-4 lg:px-6 2xl:px-12
            py-4 lg:py-6 2xl:py-12
          "
        >
          {/* MOBILE */}
          <div className="lg:hidden h-full overflow-y-auto pb-24">
            {mobileTab === "explore" && (
              <div className="space-y-4">
                <WelcomePanel
                  title={t.welcomeTitle}
                  subtitle={t.welcomeSubtitle}
                  helpTitle={t.helpTitle}
                  helpSteps={t.helpSteps}
                  helpButtonLabel={t.helpButtonLabel}
                  helpPanelTitle={t.helpPanelTitle}
                  helpSections={t.helpSections}
                />
                <div className="h-[520px]">
                  <CategoryGrid
                    categories={t.categories}
                    onSelectCategory={(label) => {
                      setSelectedCategory(label)
                      const first = mapMarkers.find((m) => m.category === label)
                      setSelectedMarkerId(first ? first.id : null)
                      setMobileTab("map")
                    }}
                  />
                </div>
              </div>
            )}

            {mobileTab === "map" && (
              <div className="h-[720px]">
                <MapPanel
                  title={t.map.title}
                  floorLabel={t.map.floorLabel}
                  level1={t.map.level1}
                  level2={t.map.level2}
                  placeholder={t.map.placeholder}
                  zoneParking={t.map.zoneParking}
                  zoneBanks={t.map.zoneBanks}
                  zoneShopping={t.map.zoneShopping}
                  zoneFood={t.map.zoneFood}
                  legendYouAreHere={t.map.legendYouAreHere}
                  legendFireExit={t.map.legendFireExit}
                  legendAccessible={t.map.legendAccessible}
                  legendSelected={t.map.legendSelected}
                  zoomOut={t.map.zoomOut}
                  zoomIn={t.map.zoomIn}
                  markers={mapMarkers}
                  selectedCategory={selectedCategory}
                  selectedMarkerId={selectedMarkerId}
                  onSelectMarker={setSelectedMarkerId}
                  showList={showLocationList}
                  onToggleList={() => setShowLocationList((v) => !v)}
                  listTitle="Locations"
                />
              </div>
            )}

            {mobileTab === "offers" && (
              <div className="h-[720px]">
                <PromoPanel
                  header={t.promoHeader}
                  offers={t.promoOffers}
                  promotionsTitle={t.promotionsTitle}
                  promotions={t.promotions}
                />
              </div>
            )}
          </div>

          {/* DESKTOP/TABLET */}
          <div className="hidden lg:grid h-full grid-cols-12 gap-6 2xl:gap-12 items-stretch">
            <section className="col-span-3 h-full overflow-hidden">
              <PromoPanel
                header={t.promoHeader}
                offers={t.promoOffers}
                promotionsTitle={t.promotionsTitle}
                promotions={t.promotions}
              />
            </section>

            <section className="col-span-5 h-full overflow-hidden flex flex-col gap-6 2xl:gap-12">
              <WelcomePanel
                title={t.welcomeTitle}
                subtitle={t.welcomeSubtitle}
                helpTitle={t.helpTitle}
                helpSteps={t.helpSteps}
                helpButtonLabel={t.helpButtonLabel}
                helpPanelTitle={t.helpPanelTitle}
                helpSections={t.helpSections}
              />
              <div className="flex-1 overflow-hidden">
                <CategoryGrid
                  categories={t.categories}
                  onSelectCategory={(label) => {
                    setSelectedCategory(label)
                    const first = mapMarkers.find((m) => m.category === label)
                    setSelectedMarkerId(first ? first.id : null)
                  }}
                />
              </div>
            </section>

            <section className="col-span-4 h-full overflow-hidden 2xl:pt-2">
              <MapPanel
                title={t.map.title}
                floorLabel={t.map.floorLabel}
                level1={t.map.level1}
                level2={t.map.level2}
                placeholder={t.map.placeholder}
                zoneParking={t.map.zoneParking}
                zoneBanks={t.map.zoneBanks}
                zoneShopping={t.map.zoneShopping}
                zoneFood={t.map.zoneFood}
                legendYouAreHere={t.map.legendYouAreHere}
                legendFireExit={t.map.legendFireExit}
                legendAccessible={t.map.legendAccessible}
                legendSelected={t.map.legendSelected}
                zoomOut={t.map.zoomOut}
                zoomIn={t.map.zoomIn}
                markers={mapMarkers}
                selectedCategory={selectedCategory}
                selectedMarkerId={selectedMarkerId}
                onSelectMarker={setSelectedMarkerId}
                showList={showLocationList}
                onToggleList={() => setShowLocationList((v) => !v)}
                listTitle="Locations"
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
