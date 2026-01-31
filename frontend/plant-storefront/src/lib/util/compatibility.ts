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
 * Check if a product is a pot based on metadata
 */
export function isPotProduct(product: HttpTypes.StoreProduct): boolean {
  return (product.metadata as PotMetadata)?.environment === "pot"
}

/**
 * Get compatible pot sizes from plant metadata
 */
export function getPlantSize(
  product: HttpTypes.StoreProduct
): "S" | "M" | "L" | "XL" | "XXL" | null {
  if (!isPlantProduct(product)) return null
  const metadata = product.metadata as PlantMetadata
  return metadata.environment === "indoor" ? metadata.size : null
}

/**
 * Extract size from variant title (e.g., "Petit (12cm)" -> "Petit (12cm)")
 * Handles different formats of size strings
 */
function normalizeSize(size: string): string {
  return size.trim().toUpperCase()
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
 * Find matching pot variants for a plant's compatible sizes
 */
export function findCompatiblePotVariants(
  potProduct: HttpTypes.StoreProduct,
  compatibleSizes: string[]
): HttpTypes.StoreProductVariant[] {
  if (!potProduct.variants) return []

  return potProduct.variants.filter((variant) => {
    if (!variant.title) return false
    return compatibleSizes.some((size) =>
      variantMatchesSizeLabel(variant.title!, size)
    )
  })
}

/**
 * Get the matched sizes for display
 */
function getMatchedSizes(
  matchingVariants: HttpTypes.StoreProductVariant[],
  compatibleSizes: string[]
): string[] {
  const matched: string[] = []

  for (const variant of matchingVariants) {
    const variantTitle = variant.title
    if (!variantTitle) continue

    for (const size of compatibleSizes) {
      if (variantMatchesSizeLabel(variantTitle, size) && !matched.includes(size)) {
        matched.push(size)
      }
    }
  }

  return matched
}

/**
 * Build list of compatible pots with their matching variants
 */
export function buildCompatiblePots(
  allPots: HttpTypes.StoreProduct[],
  plantSize: string
): CompatiblePot[] {
  const compatiblePots: CompatiblePot[] = []

  const normalizedPlantSize = normalizeSize(plantSize)

  for (const pot of allPots) {
    if (!isPotProduct(pot)) continue

    const potMetadata = pot.metadata as PotMetadata
    const potSizes = potMetadata?.compatible_sizes?.map(normalizeSize) || []
    if (!potSizes.includes(normalizedPlantSize)) {
      continue
    }

    const matchingVariants = findCompatiblePotVariants(pot, [normalizedPlantSize])

    if (matchingVariants.length > 0) {
      const matchedSizes = getMatchedSizes(matchingVariants, [normalizedPlantSize])

      compatiblePots.push({
        product: pot as PotProduct,
        matchingVariants,
        matchedSizes,
      })
    }
  }

  return compatiblePots
}

/**
 * Find plants compatible with a specific pot variant size
 */
export function findPlantsForPotSize(
  plants: HttpTypes.StoreProduct[],
  compatibleSizes: string[]
): HttpTypes.StoreProduct[] {
  return plants.filter((plant) => {
    if (!isPlantProduct(plant)) return false
    const plantSize = getPlantSize(plant)
    if (!plantSize) return false
    return compatibleSizes.map(normalizeSize).includes(normalizeSize(plantSize))
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
