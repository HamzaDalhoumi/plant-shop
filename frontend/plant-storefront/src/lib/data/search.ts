"use server"

import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { getRegion } from "./regions"

/**
 * Search products by query
 */
export async function searchProducts({
  query,
  countryCode,
  limit = 20,
}: {
  query: string
  countryCode: string
  limit?: number
}): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> {
  if (!query || query.trim().length < 2) {
    return { products: [], count: 0 }
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return { products: [], count: 0 }
  }

  try {
    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        q: query.trim(),
        limit,
        offset: 0,
        region_id: region.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,+collection,",
      },
      cache: "no-store",
    })

    return {
      products: response.products || [],
      count: response.count || 0,
    }
  } catch (error) {
    console.error("[searchProducts] Error:", error)
    return { products: [], count: 0 }
  }
}
