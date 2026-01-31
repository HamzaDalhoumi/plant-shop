import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { getCompatiblePlantsForPot } from "@lib/data/compatibility"
import { isPotProduct } from "@lib/util/compatibility"
import ProductPreview from "@modules/products/components/product-preview"
import { getTranslations } from "next-intl/server"

type CompatiblePlantsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default async function CompatiblePlants({
  product,
  region,
  countryCode,
}: CompatiblePlantsProps) {
  const t = await getTranslations("products")
  if (!isPotProduct(product)) {
    return null
  }

  const compatiblePlants = await getCompatiblePlantsForPot({
    pot: product,
    countryCode,
  })

  if (compatiblePlants.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-6" data-testid="compatible-plants">
      <div className="flex flex-col gap-1">
        <Heading level="h2" className="text-xl font-semibold text-ui-fg-base">
          {t("plantsForThisPot")}
        </Heading>
        <Text className="text-sm text-ui-fg-subtle">
          {t("plantsFitPerfectly", {
            size: (product.metadata as any)?.compatible_sizes?.join(", ") || "",
          })}
        </Text>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
        {compatiblePlants.slice(0, 8).map((plant) => (
          <li key={plant.id}>
            <ProductPreview product={plant} region={region} />
          </li>
        ))}
      </ul>
    </div>
  )
}
