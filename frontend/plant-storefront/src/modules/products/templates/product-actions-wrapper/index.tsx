import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { getCompatiblePotsForPlant } from "@lib/data/compatibility"
import { isPlantProduct } from "@lib/util/compatibility"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  countryCode,
}: {
  id: string
  region: HttpTypes.StoreRegion
  countryCode: string
}) {
  const product = await listProducts({
    queryParams: { id: [id] },
    regionId: region.id,
  }).then(({ response }) => response.products[0])

  if (!product) {
    return null
  }

  // Fetch compatible pots if this is a plant
  let compatiblePots = null
  if (isPlantProduct(product)) {
    compatiblePots = await getCompatiblePotsForPlant({
      plant: product,
      countryCode,
    })
  }

  return (
    <ProductActions 
      product={product} 
      region={region} 
      compatiblePots={compatiblePots}
    />
  )
}
