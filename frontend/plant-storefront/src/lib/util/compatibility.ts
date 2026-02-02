import { HttpTypes } from "@medusajs/types"
import {
  PlantMetadata,
  PotMetadata,
  CompatiblePot,
  PotProduct,
} from "@/types/compatibility"

/**
 * Check if a product is a plant based on metadata
 */
export function isPlantProduct(product: HttpTypes.StoreProduct): boolean {
  const metadata = product.metadata as PlantMetadata | undefined
  return metadata?.environment === "indoor" || metadata?.environment === "outdoor"
}

/**
 * Check if a product is a pot based on metadata or product type/category
 * Important: Must not match plant names like "Pothos" that contain "pot"
 */
export function isPotProduct(product: HttpTypes.StoreProduct): boolean {
  const metadata = product.metadata as PotMetadata | undefined
  
  // Primary check: metadata environment must be "pot"
  if (metadata?.environment === "pot") return true
  
  // IMPORTANT: If metadata has environment set to indoor/outdoor, it's a plant, not a pot
  if (metadata?.environment === "indoor" || metadata?.environment === "outdoor") {
    return false
  }
  
  // Fallback for products without environment metadata:
  // Check if title/handle explicitly indicates a pot container
  const title = product.title?.toLowerCase() || ""
  const handle = product.handle?.toLowerCase() || ""
  const type = (product as any).type?.value?.toLowerCase() || ""
  
  // Check for explicit pot-related terms (not just containing "pot")
  const potPatterns = [
    /\bpot\b/,           // "pot" as a word
    /\bpots\b/,          // "pots" plural
    /cache[- ]?pot/,     // "cache-pot" or "cachepot"
    /\bjardinière\b/i,   // French for planter
    /\bplanter\b/,       // planter
    /\bbac\b/,           // container/tub in French
  ]
  
  // Must match pot pattern AND not be a plant (check against plant keywords)
  const plantKeywords = ["pothos", "potos", "epipremnum"]
  const isPlantName = plantKeywords.some(keyword => 
    title.includes(keyword) || handle.includes(keyword)
  )
  
  if (isPlantName) return false
  
  const matchesPotPattern = potPatterns.some(pattern => 
    pattern.test(title) || pattern.test(handle)
  )
  
  return matchesPotPattern || type === "pot" || type.includes("cache-pot")
}

/**
 * Get plant diameter from metadata
 */
export function getPlantDiameter(product: HttpTypes.StoreProduct): number | null {
  if (!isPlantProduct(product)) return null
  const metadata = product.metadata as PlantMetadata
  return metadata?.diameter_cm || null
}

/**
 * Get pot diameter from metadata
 */
export function getPotDiameter(product: HttpTypes.StoreProduct): number | null {
  if (!isPotProduct(product)) return null
  const metadata = product.metadata as PotMetadata
  return metadata?.diameter_cm || null
}

/**
 * Get compatible pot sizes from plant metadata (legacy - kept for backward compatibility)
 */
export function getPlantSize(
  product: HttpTypes.StoreProduct
): "S" | "M" | "L" | "XL" | "XXL" | null {
  if (!isPlantProduct(product)) return null
  const metadata = product.metadata as PlantMetadata
  
  // For indoor plants, use the size directly
  if (metadata.environment === "indoor" && metadata.size) {
    return metadata.size
  }
  
  // For outdoor plants or when size is not set, estimate from diameter
  const diameter = metadata.diameter_cm
  if (diameter) {
    if (diameter <= 10) return "S"
    if (diameter <= 15) return "M"
    if (diameter <= 20) return "L"
    if (diameter <= 30) return "XL"
    return "XXL"
  }
  
  return null
}

/**
 * Extract diameter from variant title (e.g., "Petit (12cm)" -> 12)
 */
function extractDiameterFromVariant(variantTitle: string): number | null {
  // Match patterns like "(12cm)", "(12 cm)", "12cm", "Ø12", etc.
  const patterns = [
    /\((\d+)\s*cm\)/i,     // (12cm) or (12 cm)
    /(\d+)\s*cm/i,          // 12cm or 12 cm
    /Ø\s*(\d+)/i,           // Ø12
    /diamètre\s*(\d+)/i,    // diamètre 12
  ]
  
  for (const pattern of patterns) {
    const match = variantTitle.match(pattern)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
  }
  return null
}

/**
 * Check if pot variant is compatible with plant diameter
 * Rule: pot diameter should be 2-6 cm larger than plant diameter
 */
function isPotVariantCompatible(
  potVariantTitle: string,
  plantDiameter: number,
  potBaseDiameter?: number
): boolean {
  const potVariantDiameter = extractDiameterFromVariant(potVariantTitle) || potBaseDiameter
  
  if (!potVariantDiameter) return true // If can't determine, include it
  
  // Pot should be 2-6 cm larger than plant for a good fit
  const minPotDiameter = plantDiameter + 2
  const maxPotDiameter = plantDiameter + 6
  
  return potVariantDiameter >= minPotDiameter && potVariantDiameter <= maxPotDiameter
}

const SIZE_LABELS: Record<string, string[]> = {
  S: ["S", "PETIT"],
  M: ["M", "MOYEN"],
  L: ["L", "GRAND"],
  XL: ["XL", "XXL", "TRÈS GRAND", "TRES GRAND"],
}

function variantMatchesSizeLabel(variantTitle: string, size: string): boolean {
  const normalizedVariant = variantTitle.toUpperCase()
  const labels = SIZE_LABELS[size] || [size]
  return labels.some((label) => normalizedVariant.includes(label))
}

/**
 * Find matching pot variants based on plant diameter
 */
export function findCompatiblePotVariants(
  potProduct: HttpTypes.StoreProduct,
  plantDiameter: number
): HttpTypes.StoreProductVariant[] {
  if (!potProduct.variants) return []
  
  const potMetadata = potProduct.metadata as PotMetadata
  const potBaseDiameter = potMetadata?.diameter_cm
  
  // Filter variants where pot diameter is larger than plant diameter
  const compatibleVariants = potProduct.variants.filter((variant) => {
    if (!variant.title) return false
    return isPotVariantCompatible(variant.title, plantDiameter, potBaseDiameter)
  })
  
  // If no specific compatible variants found, return all variants
  // (let user choose)
  return compatibleVariants.length > 0 ? compatibleVariants : potProduct.variants
}

/**
 * Build list of compatible pots based on plant diameter
 * A pot is compatible if its diameter is larger than the plant diameter
 */
export function buildCompatiblePots(
  allPots: HttpTypes.StoreProduct[],
  plantDiameterOrSize: number | string
): CompatiblePot[] {
  const compatiblePots: CompatiblePot[] = []
  
  // Convert size string to approximate diameter if needed
  let plantDiameter: number
  if (typeof plantDiameterOrSize === "string") {
    // Estimate diameter from size label
    const sizeToDiameter: Record<string, number> = {
      S: 8,
      M: 12,
      L: 17,
      XL: 25,
      XXL: 35,
    }
    plantDiameter = sizeToDiameter[plantDiameterOrSize.toUpperCase()] || 12
  } else {
    plantDiameter = plantDiameterOrSize
  }

  for (const pot of allPots) {
    if (!isPotProduct(pot)) continue
    
    const potMetadata = pot.metadata as PotMetadata
    const potDiameter = potMetadata?.diameter_cm
    
    // A pot is compatible if its base diameter is larger than plant diameter
    // Or if it has no diameter info (we'll check variants)
    if (potDiameter && potDiameter <= plantDiameter) {
      continue // Skip pots that are too small
    }

    // Find matching variants based on diameter
    const matchingVariants = findCompatiblePotVariants(pot, plantDiameter)

    if (matchingVariants.length > 0) {
      // Determine matched sizes for display
      const matchedSizes: string[] = []
      for (const variant of matchingVariants) {
        const diameter = extractDiameterFromVariant(variant.title || "")
        if (diameter) {
          matchedSizes.push(`${diameter}cm`)
        }
      }

      compatiblePots.push({
        product: pot as PotProduct,
        matchingVariants,
        matchedSizes: matchedSizes.length > 0 ? matchedSizes : ["Compatible"],
      })
    }
  }

  return compatiblePots
}

/**
 * Find plants compatible with a specific pot diameter
 */
export function findPlantsForPotSize(
  plants: HttpTypes.StoreProduct[],
  potDiameter: number
): HttpTypes.StoreProduct[] {
  return plants.filter((plant) => {
    if (!isPlantProduct(plant)) return false
    const plantDiameter = getPlantDiameter(plant)
    if (!plantDiameter) return false
    // Plant diameter should be smaller than pot diameter (2-6 cm smaller)
    return plantDiameter >= potDiameter - 6 && plantDiameter <= potDiameter - 2
  })
}

/**
 * Get the cheapest variant from a list of variants
 */
export function getCheapestVariant(
  variants: HttpTypes.StoreProductVariant[]
): HttpTypes.StoreProductVariant | undefined {
  if (variants.length === 0) return undefined

  return variants.reduce((cheapest, variant) => {
    const cheapestPrice =
      (cheapest as any).calculated_price?.calculated_amount ?? Infinity
    const variantPrice =
      (variant as any).calculated_price?.calculated_amount ?? Infinity
    return variantPrice < cheapestPrice ? variant : cheapest
  }, variants[0])
}
