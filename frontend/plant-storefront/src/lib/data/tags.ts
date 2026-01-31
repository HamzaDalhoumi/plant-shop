"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listTags = async (
  queryParams: Record<string, string> = {}
): Promise<{ tags: HttpTypes.StoreProductTag[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("tags")),
  }

  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return sdk.client
    .fetch<{ product_tags: HttpTypes.StoreProductTag[]; count: number }>(
      "/store/product-tags",
      {
        query: queryParams,
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_tags, count }) => ({ tags: product_tags, count }))
}
