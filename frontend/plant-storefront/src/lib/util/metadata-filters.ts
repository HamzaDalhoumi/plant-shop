import { HttpTypes } from "@medusajs/types"
import { PlantMetadata, PotMetadata } from "@/types/compatibility"

export type FilterOption = {
  value: string
  label: string
  count: number
}

export type FilterGroup = {
  key: string
  label: string
  labelFr: string
  type: "checkbox" | "range" | "color"
  options: FilterOption[]
  min?: number
  max?: number
  environment?: "indoor" | "outdoor" | "pot" | "all"
}

export type SelectedFilters = Record<string, string[]>

// Filter configuration with French labels - organized by environment
const FILTER_CONFIG: Record<string, { 
  label: string
  labelFr: string
  type: "checkbox" | "range" | "color"
  order: number
  environments: ("indoor" | "outdoor" | "pot" | "all")[]
}> = {
  // Common filters
  price: { label: "Price", labelFr: "Prix", type: "range", order: 1, environments: ["all"] },
  
  // Indoor plant filters
  size: { label: "Size", labelFr: "Taille", type: "checkbox", order: 2, environments: ["indoor"] },
  water_needs: { label: "Water needs", labelFr: "Besoin en eau", type: "checkbox", order: 3, environments: ["indoor", "outdoor"] },
  light: { label: "Light", labelFr: "Lumière", type: "checkbox", order: 4, environments: ["indoor", "outdoor"] },
  difficulty: { label: "Difficulty", labelFr: "Niveau d'entretien", type: "checkbox", order: 5, environments: ["indoor"] },
  color: { label: "Color", labelFr: "Couleur", type: "color", order: 6, environments: ["indoor"] },
  family: { label: "Plant family", labelFr: "Famille", type: "checkbox", order: 7, environments: ["indoor"] },
  features: { label: "Features", labelFr: "Caractéristiques", type: "checkbox", order: 8, environments: ["indoor"] },
  placement: { label: "Room", labelFr: "Pièce", type: "checkbox", order: 9, environments: ["indoor", "outdoor"] },
  shape: { label: "Shape", labelFr: "Forme", type: "checkbox", order: 10, environments: ["indoor"] },
  style: { label: "Style", labelFr: "Style", type: "checkbox", order: 11, environments: ["indoor"] },
  hanging: { label: "Standing or hanging", labelFr: "Port de la plante", type: "checkbox", order: 12, environments: ["indoor"] },
  rarity: { label: "Rarity", labelFr: "Rareté", type: "checkbox", order: 13, environments: ["indoor"] },
  height_cm: { label: "Height", labelFr: "Hauteur (cm)", type: "range", order: 14, environments: ["indoor", "outdoor", "pot"] },
  diameter_cm: { label: "Diameter", labelFr: "Diamètre (cm)", type: "range", order: 15, environments: ["indoor", "outdoor", "pot"] },
  
  // Outdoor plant filters
  sun_exposure: { label: "Sun exposure", labelFr: "Exposition au soleil", type: "checkbox", order: 4, environments: ["outdoor"] },
  climate: { label: "Climate", labelFr: "Climat", type: "checkbox", order: 9, environments: ["outdoor"] },
  frost_resistant: { label: "Frost resistant", labelFr: "Résistant au gel", type: "checkbox", order: 10, environments: ["outdoor"] },
  season: { label: "Season", labelFr: "Saison", type: "checkbox", order: 11, environments: ["outdoor"] },
  
  // Pot filters
  material: { label: "Material", labelFr: "Matériau", type: "checkbox", order: 2, environments: ["pot"] },
  drainage: { label: "Drainage", labelFr: "Drainage", type: "checkbox", order: 6, environments: ["pot"] },
  
  // Collections and tags
  collection: { label: "Collection", labelFr: "Collection", type: "checkbox", order: 90, environments: ["all"] },
  tag: { label: "Tag", labelFr: "Étiquette", type: "checkbox", order: 91, environments: ["all"] },
}

// Value labels for filters (French)
const VALUE_LABELS: Record<string, Record<string, string>> = {
  size: { 
    S: "Petite (S)", 
    M: "Moyenne (M)", 
    L: "Grande (L)", 
    XL: "Très grande (XL)", 
    XXL: "Extra grande (XXL)" 
  },
  water_needs: {
    weekly: "1× par semaine",
    biweekly: "1× par 2 semaines",
    monthly: "1× par mois",
    low: "Faible",
    medium: "Modéré",
    high: "Élevé",
  },
  light: {
    direct_sun: "Soleil direct",
    indirect_light: "Lumière indirecte",
    partial_shade: "Mi-ombre",
    low_light: "Faible luminosité",
    full_sun: "Plein soleil",
    shade: "Ombre",
  },
  sun_exposure: {
    full_sun: "Plein soleil",
    partial_shade: "Mi-ombre",
    shade: "Ombre",
  },
  hanging: { 
    true: "Plante retombante", 
    false: "Plante dressée" 
  },
  shape: {
    cylinder: "Cylindrique",
    tower: "Colonnaire",
    bush: "Buissonnant",
    trailing: "Retombant",
    rosette: "En rosette",
  },
  placement: {
    salon: "Salon",
    bureau: "Bureau",
    chambre: "Chambre",
    salle_de_bains: "Salle de bain",
    cuisine: "Cuisine",
    couloir: "Couloir",
    terrasse: "Terrasse",
    balcon: "Balcon",
    jardin: "Jardin",
  },
  climate: {
    temperate: "Tempéré",
    tropical: "Tropical",
    mediterranean: "Méditerranéen",
    arid: "Aride",
  },
  season: {
    spring: "Printemps",
    summer: "Été",
    autumn: "Automne",
    winter: "Hiver",
  },
  style: { 
    nature: "Naturel", 
    modern: "Moderne", 
    basic: "Classique", 
    exotic: "Exotique" 
  },
  difficulty: { 
    easy: "Facile", 
    medium: "Intermédiaire", 
    expert: "Expert" 
  },
  rarity: { 
    common: "Commune", 
    rare: "Rare", 
    hybrid: "Hybride" 
  },
  material: { 
    ceramic: "Céramique", 
    terracotta: "Terre cuite", 
    plastic: "Plastique", 
    concrete: "Béton",
    metal: "Métal",
    wood: "Bois",
  },
  features: {
    comfortable: "Facile d'entretien",
    air_purifying: "Purifie l'air",
    pet_friendly: "Non toxique",
    hanging_plant: "Suspendu",
  },
  frost_resistant: {
    true: "Résistant au gel",
    false: "Sensible au gel",
  },
  drainage: {
    true: "Avec drainage",
    false: "Sans drainage",
  },
}

// Color labels and hex codes
const COLOR_CONFIG: Record<string, { label: string; hex: string }> = {
  green: { label: "Vert", hex: "#228B22" },
  dark_green: { label: "Vert foncé", hex: "#006400" },
  light_green: { label: "Vert clair", hex: "#90EE90" },
  variegated: { label: "Panaché", hex: "linear-gradient(45deg, #228B22 50%, #FFFDD0 50%)" },
  red: { label: "Rouge", hex: "#DC143C" },
  pink: { label: "Rose", hex: "#FF69B4" },
  purple: { label: "Violet", hex: "#9370DB" },
  orange: { label: "Orange", hex: "#FFA500" },
  yellow: { label: "Jaune", hex: "#FFD700" },
  white: { label: "Blanc", hex: "#FFFFFF" },
  brown: { label: "Brun", hex: "#8B4513" },
  blue: { label: "Bleu", hex: "#4169E1" },
  silver: { label: "Argenté", hex: "#C0C0C0" },
  multicolor: { label: "Multicolore", hex: "linear-gradient(45deg, #FF6B6B, #4ECDC4, #FFE66D)" },
}

const normalizeValue = (value: string | boolean | number) =>
  typeof value === "boolean" ? String(value) : String(value)

const formatLabel = (key: string, value: string) => {
  if (VALUE_LABELS[key]?.[value]) return VALUE_LABELS[key][value]
  if (key === "color" && COLOR_CONFIG[value]) return COLOR_CONFIG[value].label
  return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

const addOption = (
  map: Map<string, Map<string, number>>,
  key: string,
  value: string | boolean | number | undefined
) => {
  if (value === undefined || value === null) return
  const normalizedValue = normalizeValue(value)
  if (!map.has(key)) map.set(key, new Map())
  const bucket = map.get(key)!
  bucket.set(normalizedValue, (bucket.get(normalizedValue) || 0) + 1)
}

const addRangeValues = (
  ranges: Map<string, { min: number; max: number }>,
  key: string,
  value: number | undefined
) => {
  if (value === undefined || value === null) return
  if (!ranges.has(key)) {
    ranges.set(key, { min: value, max: value })
  } else {
    const current = ranges.get(key)!
    current.min = Math.min(current.min, value)
    current.max = Math.max(current.max, value)
  }
}

export const buildMetadataFilters = (
  products: HttpTypes.StoreProduct[],
  environment?: "indoor" | "outdoor" | "pot"
): FilterGroup[] => {
  const optionsMap = new Map<string, Map<string, number>>()
  const rangeMap = new Map<string, { min: number; max: number }>()
  const featuresMap = new Map<string, number>()

  products.forEach((product) => {
    const metadata = product.metadata as PlantMetadata | PotMetadata | undefined
    if (!metadata) return

    // Indoor plants
    if (metadata.environment === "indoor") {
      addOption(optionsMap, "size", metadata.size)
      addOption(optionsMap, "family", metadata.family)
      metadata.placement?.forEach((value) => addOption(optionsMap, "placement", value))
      addOption(optionsMap, "light", metadata.light)
      addOption(optionsMap, "difficulty", metadata.difficulty)
      addOption(optionsMap, "rarity", metadata.rarity)
      addOption(optionsMap, "water_needs", metadata.water_needs)
      addOption(optionsMap, "color", metadata.color)
      addOption(optionsMap, "shape", metadata.shape)
      addOption(optionsMap, "style", metadata.style)
      addOption(optionsMap, "hanging", metadata.hanging)

      addRangeValues(rangeMap, "height_cm", metadata.height_cm)
      addRangeValues(rangeMap, "diameter_cm", metadata.diameter_cm)

      // Features as individual flags
      if (metadata.comfortable) featuresMap.set("comfortable", (featuresMap.get("comfortable") || 0) + 1)
      if (metadata.air_purifying) featuresMap.set("air_purifying", (featuresMap.get("air_purifying") || 0) + 1)
      if (metadata.pet_friendly) featuresMap.set("pet_friendly", (featuresMap.get("pet_friendly") || 0) + 1)
      if (metadata.hanging) featuresMap.set("hanging_plant", (featuresMap.get("hanging_plant") || 0) + 1)
    }

    // Outdoor plants
    if (metadata.environment === "outdoor") {
      addOption(optionsMap, "sun_exposure", metadata.sun_exposure)
      addOption(optionsMap, "water_needs", metadata.watering)
      metadata.climate?.forEach((value) => addOption(optionsMap, "climate", value))
      metadata.season?.forEach((value) => addOption(optionsMap, "season", value))
      addOption(optionsMap, "frost_resistant", metadata.frost_resistant)
      
      addRangeValues(rangeMap, "height_cm", metadata.height_cm)
      addRangeValues(rangeMap, "diameter_cm", metadata.diameter_cm)
    }

    // Pots
    if (metadata.environment === "pot") {
      addOption(optionsMap, "material", metadata.material)
      addOption(optionsMap, "drainage", metadata.drainage)
      addRangeValues(rangeMap, "diameter_cm", metadata.diameter_cm)
      addRangeValues(rangeMap, "height_cm", metadata.height_cm)
    }
  })

  // Add features group if any features found
  if (featuresMap.size > 0) {
    const featuresOptions = new Map<string, number>()
    featuresMap.forEach((count, key) => featuresOptions.set(key, count))
    optionsMap.set("features", featuresOptions)
  }

  const filterGroups: FilterGroup[] = []

  // Build filter groups from options
  optionsMap.forEach((values, key) => {
    const config = FILTER_CONFIG[key]
    if (!config) return
    
    // Skip filters not relevant to current environment
    if (environment && !config.environments.includes(environment) && !config.environments.includes("all")) {
      return
    }

    const options = Array.from(values.entries())
      .map(([value, count]) => ({ value, label: formatLabel(key, value), count }))
      .sort((a, b) => {
        // Custom sort orders
        if (key === "size") {
          const order = ["S", "M", "L", "XL", "XXL"]
          return order.indexOf(a.value) - order.indexOf(b.value)
        }
        if (key === "difficulty") {
          const order = ["easy", "medium", "expert"]
          return order.indexOf(a.value) - order.indexOf(b.value)
        }
        if (key === "water_needs") {
          const order = ["weekly", "biweekly", "monthly", "low", "medium", "high"]
          return order.indexOf(a.value) - order.indexOf(b.value)
        }
        if (key === "season") {
          const order = ["spring", "summer", "autumn", "winter"]
          return order.indexOf(a.value) - order.indexOf(b.value)
        }
        // Default: sort by count descending, then alphabetically
        if (b.count !== a.count) return b.count - a.count
        return a.label.localeCompare(b.label, "fr")
      })

    if (options.length === 0) return

    filterGroups.push({
      key,
      label: config.label,
      labelFr: config.labelFr,
      type: key === "color" ? "color" : "checkbox",
      options,
    })
  })

  // Build range filter groups
  rangeMap.forEach((range, key) => {
    const config = FILTER_CONFIG[key]
    if (!config || config.type !== "range") return
    
    // Skip filters not relevant to current environment
    if (environment && !config.environments.includes(environment) && !config.environments.includes("all")) {
      return
    }

    filterGroups.push({
      key,
      label: config.label,
      labelFr: config.labelFr,
      type: "range",
      options: [],
      min: Math.floor(range.min),
      max: Math.ceil(range.max),
    })
  })

  // Sort by configured order
  filterGroups.sort((a, b) => {
    const orderA = FILTER_CONFIG[a.key]?.order ?? 99
    const orderB = FILTER_CONFIG[b.key]?.order ?? 99
    return orderA - orderB
  })

  return filterGroups
}

export const parseSelectedFilters = (
  params: Record<string, string | undefined>
): SelectedFilters => {
  const selected: SelectedFilters = {}

  Object.keys(FILTER_CONFIG).forEach((key) => {
    const value = params[key]
    if (!value) return
    selected[key] = value.split(",").map((entry) => entry.trim())
  })

  if (params.height_min || params.height_max) {
    selected.height_cm = [`${params.height_min || 0}-${params.height_max || 999}`]
  }
  if (params.diameter_min || params.diameter_max) {
    selected.diameter_cm = [`${params.diameter_min || 0}-${params.diameter_max || 999}`]
  }
  if (params.price_min || params.price_max) {
    selected.price = [`${params.price_min || 0}-${params.price_max || 999999}`]
  }

  return selected
}

export const filterProductsByMetadata = (
  products: HttpTypes.StoreProduct[],
  selected: SelectedFilters
) => {
  const entries = Object.entries(selected)
  if (!entries.length) return products

  return products.filter((product) => {
    const metadata = product.metadata as PlantMetadata | PotMetadata | undefined
    if (!metadata) return false

    return entries.every(([key, values]) => {
      if (values.length === 0) return true

      // Collection filter
      if (key === "collection") {
        const handles = product.collection?.handle ? [product.collection.handle] : []
        return values.some((v) => handles.includes(v))
      }

      // Tag filter
      if (key === "tag") {
        const tags = product.tags?.map((t) => t.value) || []
        return values.some((v) => tags.includes(v))
      }

      // Features filter (indoor plants only)
      if (key === "features") {
        if (metadata.environment !== "indoor") return true
        return values.every((f) => {
          if (f === "comfortable") return metadata.comfortable
          if (f === "air_purifying") return metadata.air_purifying
          if (f === "pet_friendly") return metadata.pet_friendly
          if (f === "hanging_plant") return metadata.hanging
          return true
        })
      }

      // Range filters (height, diameter, price)
      if (key === "height_cm" || key === "diameter_cm" || key === "price") {
        const [minStr, maxStr] = values[0]?.split("-") || []
        const min = parseFloat(minStr) || 0
        const max = parseFloat(maxStr) || Infinity

        if (key === "price") {
          const price = product.variants?.[0]?.calculated_price?.calculated_amount || 0
          return price >= min && price <= max
        }

        const val = key === "height_cm" 
          ? metadata.height_cm 
          : metadata.diameter_cm
        return val !== undefined && val >= min && val <= max
      }

      // Pot filters
      if (metadata.environment === "pot") {
        if (key === "material") return values.includes(String(metadata.material))
        if (key === "drainage") return values.includes(String(metadata.drainage))
      }

      // Indoor plant filters
      if (metadata.environment === "indoor") {
        if (key === "size") return values.includes(metadata.size)
        if (key === "family") return values.includes(metadata.family)
        if (key === "placement") return metadata.placement?.some((p) => values.includes(p))
        if (key === "light") return values.includes(metadata.light)
        if (key === "difficulty") return values.includes(metadata.difficulty)
        if (key === "pet_friendly") return values.includes(String(metadata.pet_friendly))
        if (key === "air_purifying") return values.includes(String(metadata.air_purifying))
        if (key === "rarity") return values.includes(metadata.rarity)
        if (key === "water_needs") return values.includes(metadata.water_needs)
        if (key === "color") return values.includes(metadata.color)
        if (key === "shape") return values.includes(metadata.shape)
        if (key === "style") return values.includes(metadata.style)
        if (key === "hanging") return values.includes(String(metadata.hanging))
      }

      // Outdoor plant filters
      if (metadata.environment === "outdoor") {
        if (key === "sun_exposure") return values.includes(metadata.sun_exposure)
        if (key === "light") return values.includes(metadata.sun_exposure) // backward compat
        if (key === "water_needs") return values.includes(metadata.watering)
        if (key === "climate") return metadata.climate?.some((c) => values.includes(c))
        if (key === "season") return metadata.season?.some((s) => values.includes(s))
        if (key === "frost_resistant") return values.includes(String(metadata.frost_resistant))
      }

      return true
    })
  })
}

export const getColorHex = (colorKey: string): string => {
  return COLOR_CONFIG[colorKey]?.hex || "#808080"
}

export const getColorLabel = (colorKey: string): string => {
  return COLOR_CONFIG[colorKey]?.label || colorKey
}

// Quick filter presets
export const QUICK_FILTERS = {
  indoor: [
    { key: "difficulty", value: "easy", label: "🌿 Facile", icon: "leaf" },
    { key: "features", value: "pet_friendly", label: "🐾 Pet-friendly", icon: "pet" },
    { key: "features", value: "air_purifying", label: "💨 Purifiant", icon: "air" },
    { key: "light", value: "low_light", label: "🌑 Peu de lumière", icon: "moon" },
    { key: "water_needs", value: "monthly", label: "💧 Peu d'eau", icon: "drop" },
    { key: "size", value: "S", label: "🌱 Petite taille", icon: "small" },
  ],
  outdoor: [
    { key: "sun_exposure", value: "full_sun", label: "☀️ Plein soleil", icon: "sun" },
    { key: "frost_resistant", value: "true", label: "❄️ Résistant au gel", icon: "frost" },
    { key: "water_needs", value: "low", label: "🏜️ Peu d'eau", icon: "cactus" },
    { key: "season", value: "spring", label: "🌸 Printemps", icon: "flower" },
    { key: "season", value: "summer", label: "🌻 Été", icon: "sunflower" },
    { key: "climate", value: "mediterranean", label: "🌴 Méditerranéen", icon: "palm" },
  ],
  pot: [
    { key: "material", value: "ceramic", label: "🏺 Céramique", icon: "ceramic" },
    { key: "material", value: "terracotta", label: "🧱 Terre cuite", icon: "terracotta" },
    { key: "drainage", value: "true", label: "💧 Avec drainage", icon: "drain" },
  ],
}
