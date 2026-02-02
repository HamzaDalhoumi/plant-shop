"use server"

import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import {
  buildCompatiblePots,
  getPlantDiameter,
  getPlantSize,
  isPotProduct,
  isPlantProduct,
  findPlantsForPotSize,
  getPotDiameter,
} from "@lib/util/compatibility"
import { CompatiblePot, PlantMetadata, PotMetadata } from "@/types/compatibility"
import { getRegion, retrieveRegion } from "./regions"

/**
 * Fetch all pot products for the region - bypasses cache for complete list
 */
export async function listPotProducts({
  countryCode,
  regionId,
}: {
  countryCode?: string
  regionId?: string
}): Promise<HttpTypes.StoreProduct[]> {
  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else if (regionId) {
    region = await retrieveRegion(regionId)
  }

  if (!region) {
    return []
  }

  // Direct API call to get ALL products (bypassing cache)
  const response = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
    `/store/products`,
    {
      method: "GET",
      query: {
        limit: 200, // High limit to get all products
        offset: 0,
        region_id: region.id,
        fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,+collection,",
      },
      cache: "no-store", // No caching for this request
    }
  )

  // Debug: log all products to see if pot is there
  console.log("[listPotProducts] All products:")
  response.products.forEach(p => {
    if (p.handle === "pots" || p.title?.toLowerCase().includes("pot")) {
      const isPot = isPotProduct(p)
      console.log(`  ** POTENTIAL POT: "${p.title}" (${p.handle}) -> isPot=${isPot}, metadata=${JSON.stringify(p.metadata)}`)
    }
  })

  // Filter to get only pot products (not plants)
  const potProducts = response.products.filter((product) => isPotProduct(product))
  
  console.log("[listPotProducts] Total products:", response.products.length)
  console.log("[listPotProducts] Pot products found:", potProducts.length)
  potProducts.forEach(p => console.log("  - Pot:", p.title, "| handle:", p.handle))
  
  return potProducts
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
 * Uses plant diameter for compatibility (pot must be larger)
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
  // Try to get diameter first, fall back to size
  const plantDiameter = getPlantDiameter(plant)
  const plantSize = getPlantSize(plant)

  if (!plantDiameter && !plantSize) {
    return []
  }

  const allPots = await listPotProducts({ countryCode, regionId })
  
  // Use diameter if available, otherwise use size
  return buildCompatiblePots(allPots, plantDiameter || plantSize!)
}

/**
 * Get compatible plants for a specific pot
 * Uses pot diameter for compatibility (pot must be larger than plant)
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

  const potDiameter = getPotDiameter(pot)
  if (!potDiameter) {
    return []
  }

  const allPlants = await listPlantProducts({ countryCode, regionId })
  return findPlantsForPotSize(allPlants, potDiameter)
}
