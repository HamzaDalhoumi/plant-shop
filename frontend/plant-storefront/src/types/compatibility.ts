import { HttpTypes } from "@medusajs/types"

// Metadata structure for plants
export type PlantMetadata =
  | {
      environment: "indoor"
      // Taille (S, M, L, XL, XXL)
      size: "S" | "M" | "L" | "XL" | "XXL"
      // Famille de plantes
      family: string
      // Pièce (Salle de bain, Chambre, Cuisine, Salon, Bureau, Couloir)
      placement: Array<"salon" | "bureau" | "chambre" | "salle_de_bains" | "cuisine" | "couloir">
      // Emplacement lumière (Soleil, Lumière indirecte, Mi-ombre)
      light: "direct_sun" | "indirect_light" | "partial_shade" | "low_light"
      // Difficulté
      difficulty: "easy" | "medium" | "expert"
      // Respectueux des animaux
      pet_friendly: boolean
      // Purificateur d'air
      air_purifying: boolean
      // Debout ou suspendu
      hanging: boolean
      // Rareté
      rarity: "common" | "rare" | "hybrid"
      // Besoin en eau (Hebdomadaire, Bi-hebdomadaire, Mensuel)
      water_needs: "weekly" | "biweekly" | "monthly"
      // Hauteur du produit (cm)
      height_cm: number
      // Diamètre du produit (cm)
      diameter_cm: number
      // Couleur dominante
      color: string
      // Forme (Cylindre, Tour, Buisson, etc.)
      shape: "cylinder" | "tower" | "bush" | "trailing" | "rosette"
      // Style
      style: "nature" | "modern" | "basic" | "exotic"
      // Confortable (facile à entretenir)
      comfortable: boolean
    }
  | {
      environment: "outdoor"
      sun_exposure: "full_sun" | "partial_shade" | "shade"
      watering: "low" | "medium" | "high"
      climate: string[]
      frost_resistant: boolean
      season: Array<"spring" | "summer" | "autumn" | "winter">
      height_cm: number
      diameter_cm: number
    }

// Metadata structure for pots
export type PotMetadata = {
  environment: "pot"
  material: "ceramic" | "terracotta" | "plastic" | "concrete"
  diameter_cm: number
  height_cm: number
  drainage: boolean
  compatible_sizes: Array<"S" | "M" | "L" | "XL">
  usage: "indoor" | "outdoor"
}

// Extended product type with typed metadata
export type PlantProduct = HttpTypes.StoreProduct & {
  metadata: PlantMetadata
}

export type PotProduct = HttpTypes.StoreProduct & {
  metadata: PotMetadata
}

// Compatible pot with matched variants
export type CompatiblePot = {
  product: PotProduct
  matchingVariants: HttpTypes.StoreProductVariant[]
  matchedSizes: string[]
}

// Compatible plant for pot pages
export type CompatiblePlant = {
  product: PlantProduct
  matchedSize: string
}

// Bundle selection state
export type BundleSelection = {
  plantVariant: HttpTypes.StoreProductVariant | null
  potVariant: HttpTypes.StoreProductVariant | null
}
