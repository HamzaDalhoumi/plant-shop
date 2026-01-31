"use server"

import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import {
  buildCompatiblePots,
  getPlantSize,
  isPotProduct,
  isPlantProduct,
  findPlantsForPotSize,
} from "@lib/util/compatibility"
import { CompatiblePot } from "@/types/compatibility"

/**
 * Fetch all pot products for the region
 */
export async function listPotProducts({
  countryCode,
  regionId,
}: {
  countryCode?: string
  regionId?: string
}): Promise<HttpTypes.StoreProduct[]> {
  const { response } = await listProducts({
    countryCode,
    regionId,
    queryParams: {
      limit: 50,
    },
  })

  return response.products.filter((product) => isPotProduct(product))
}

/**
 * Fetch all plant products for the region
 */
export async function listPlantProducts({
  countryCode,
  regionId,
}: {
  countryCode?: string
  regionId?: string
}): Promise<HttpTypes.StoreProduct[]> {
  const { response } = await listProducts({
    countryCode,
    regionId,
    queryParams: {
      limit: 100,
    },
  })

  return response.products.filter((product) => isPlantProduct(product))
}

/**
 * Get compatible pots for a specific plant product
 */
export async function getCompatiblePotsForPlant({
  plant,
  countryCode,
  regionId,
}: {
  plant: HttpTypes.StoreProduct
  countryCode?: string
  regionId?: string
}): Promise<CompatiblePot[]> {
  const plantSize = getPlantSize(plant)

  if (!plantSize) {
    return []
  }

  const allPots = await listPotProducts({ countryCode, regionId })
  return buildCompatiblePots(allPots, plantSize)
}

/**
 * Get compatible plants for a specific pot variant
 */
export async function getCompatiblePlantsForPot({
  pot,
  countryCode,
  regionId,
}: {
  pot: HttpTypes.StoreProduct
  countryCode?: string
  regionId?: string
}): Promise<HttpTypes.StoreProduct[]> {
  if (!isPotProduct(pot)) {
    return []
  }

  const potMetadata = pot.metadata as { compatible_sizes?: string[] }
  const compatibleSizes = potMetadata?.compatible_sizes || []
  if (compatibleSizes.length === 0) {
    return []
  }

  const allPlants = await listPlantProducts({ countryCode, regionId })
  return findPlantsForPotSize(allPlants, compatibleSizes)
}
