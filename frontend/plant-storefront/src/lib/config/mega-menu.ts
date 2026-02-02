/**
 * Mega Menu Configuration
 * 
 * Defines the structure for PLNTS.com-style category navigation
 * Uses metadata filters as virtual subcategories
 */

export type SubcategoryItem = {
  key: string
  filterKey: string
  filterValue: string
  icon?: string
}

export type SubcategoryGroup = {
  key: string
  items: SubcategoryItem[]
}

export type MegaMenuCategory = {
  handle: string
  groups: SubcategoryGroup[]
  featuredImage?: string
  featuredLink?: {
    href: string
    labelKey: string
  }
  shopAllLink: {
    href: string
    labelKey: string
  }
}

// Mega menu structure for Indoor Plants
export const MEGA_MENU_CONFIG: Record<string, MegaMenuCategory> = {
  "indoor-plants": {
    handle: "indoor-plants",
    groups: [
      {
        key: "bySize",
        items: [
          { key: "bulbs", filterKey: "size", filterValue: "S", icon: "🌱" },
          { key: "small", filterKey: "size", filterValue: "S" },
          { key: "medium", filterKey: "size", filterValue: "M" },
          { key: "large", filterKey: "size", filterValue: "L" },
        ],
      },
      {
        key: "byFamily",
        items: [
          { key: "alocasia", filterKey: "plant_type", filterValue: "alocasia" },
          { key: "philodendron", filterKey: "plant_type", filterValue: "philodendron" },
          { key: "monstera", filterKey: "plant_type", filterValue: "monstera" },
          { key: "hoya", filterKey: "plant_type", filterValue: "hoya" },
          { key: "anthurium", filterKey: "plant_type", filterValue: "anthurium" },
          { key: "ficus", filterKey: "plant_type", filterValue: "ficus" },
          { key: "pothos", filterKey: "plant_type", filterValue: "pothos" },
          { key: "calathea", filterKey: "plant_type", filterValue: "calathea" },
          { key: "dracaena", filterKey: "plant_type", filterValue: "dracaena" },
          { key: "palm", filterKey: "plant_type", filterValue: "palm" },
          { key: "succulent", filterKey: "plant_type", filterValue: "succulent" },
          { key: "cactus", filterKey: "plant_type", filterValue: "cactus" },
        ],
      },
      {
        key: "byRoom",
        items: [
          { key: "bathroom", filterKey: "room_suitability", filterValue: "salle_de_bains", icon: "🚿" },
          { key: "bedroom", filterKey: "room_suitability", filterValue: "chambre", icon: "🛏️" },
          { key: "livingRoom", filterKey: "room_suitability", filterValue: "salon", icon: "🛋️" },
          { key: "office", filterKey: "room_suitability", filterValue: "bureau", icon: "💼" },
          { key: "kitchen", filterKey: "room_suitability", filterValue: "cuisine", icon: "🍳" },
        ],
      },
      {
        key: "byFeature",
        items: [
          { key: "easy", filterKey: "difficulty", filterValue: "easy", icon: "🌿" },
          { key: "petFriendly", filterKey: "pet_friendly", filterValue: "true", icon: "🐾" },
          { key: "airPurifying", filterKey: "air_purifying", filterValue: "true", icon: "💨" },
          { key: "lowLight", filterKey: "light", filterValue: "low_light", icon: "🌑" },
          { key: "hanging", filterKey: "hanging", filterValue: "true", icon: "🌿" },
          { key: "rare", filterKey: "rarity", filterValue: "rare", icon: "✨" },
        ],
      },
    ],
    featuredImage: "/images/mega-menu/indoor-plants.jpg",
    featuredLink: {
      href: "/category/indoor-plants?new=true",
      labelKey: "shopNewIndoorPlants",
    },
    shopAllLink: {
      href: "/category/indoor-plants",
      labelKey: "shopAllIndoorPlants",
    },
  },
  "outdoor-plants": {
    handle: "outdoor-plants",
    groups: [
      {
        key: "bySunExposure",
        items: [
          { key: "fullSun", filterKey: "sun_exposure", filterValue: "full_sun", icon: "☀️" },
          { key: "partialShade", filterKey: "sun_exposure", filterValue: "partial_shade", icon: "⛅" },
          { key: "shade", filterKey: "sun_exposure", filterValue: "shade", icon: "🌥️" },
        ],
      },
      {
        key: "byPlantType",
        items: [
          { key: "fruitTrees", filterKey: "plant_type", filterValue: "fruit_tree", icon: "🍋" },
          { key: "palms", filterKey: "plant_type", filterValue: "palm", icon: "🌴" },
          { key: "floweringShrubs", filterKey: "plant_type", filterValue: "flowering_shrub", icon: "🌸" },
          { key: "climbers", filterKey: "plant_type", filterValue: "climber", icon: "🌿" },
          { key: "outdoorSucculents", filterKey: "plant_type", filterValue: "succulent", icon: "🌵" },
        ],
      },
      {
        key: "bySpace",
        items: [
          { key: "balcony", filterKey: "room_suitability", filterValue: "balcon", icon: "🏠" },
          { key: "terrace", filterKey: "room_suitability", filterValue: "terrasse", icon: "☂️" },
          { key: "garden", filterKey: "room_suitability", filterValue: "jardin", icon: "🌳" },
        ],
      },
      {
        key: "ourSelections",
        items: [
          { key: "heatResistant", filterKey: "heat_resistant", filterValue: "true", icon: "🏜️" },
          { key: "lowWater", filterKey: "water_needs", filterValue: "low", icon: "💧" },
          { key: "yearRoundFlowers", filterKey: "flowering_season", filterValue: "all_year", icon: "🌸" },
          { key: "fruitTreesSelection", filterKey: "plant_type", filterValue: "fruit_tree", icon: "🍊" },
        ],
      },
    ],
    shopAllLink: {
      href: "/category/outdoor-plants",
      labelKey: "shopAllOutdoorPlants",
    },
  },
  "pots": {
    handle: "pots",
    groups: [
      {
        key: "byMaterial",
        items: [
          { key: "ceramic", filterKey: "material", filterValue: "ceramic" },
          { key: "terracotta", filterKey: "material", filterValue: "terracotta" },
          { key: "plastic", filterKey: "material", filterValue: "plastic" },
          { key: "concrete", filterKey: "material", filterValue: "concrete" },
          { key: "metal", filterKey: "material", filterValue: "metal" },
        ],
      },
      {
        key: "bySize",
        items: [
          { key: "small", filterKey: "sizes_available", filterValue: "S" },
          { key: "medium", filterKey: "sizes_available", filterValue: "M" },
          { key: "large", filterKey: "sizes_available", filterValue: "L" },
          { key: "extraLarge", filterKey: "sizes_available", filterValue: "XL" },
        ],
      },
      {
        key: "byFeature",
        items: [
          { key: "withDrainage", filterKey: "drainage", filterValue: "true", icon: "💧" },
          { key: "indoor", filterKey: "usage", filterValue: "indoor" },
          { key: "outdoor", filterKey: "usage", filterValue: "outdoor" },
        ],
      },
    ],
    shopAllLink: {
      href: "/category/pots",
      labelKey: "shopAllPots",
    },
  },
}

// Helper to build URL with filter params
export function buildFilterUrl(
  categoryHandle: string,
  filterKey: string,
  filterValue: string
): string {
  return `/category/${categoryHandle}?${filterKey}=${encodeURIComponent(filterValue)}`
}
