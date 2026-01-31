import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { getCompatiblePotsForPlant } from "@lib/data/compatibility"
import { isPlantProduct } from "@lib/util/compatibility"
import PotCard from "./pot-card"
import PotSelector from "./pot-selector"

type CompatiblePotsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  mode?: "display" | "selector"
}

export default async function CompatiblePots({
  product,
  region,
  countryCode,
  mode = "display",
}: CompatiblePotsProps) {
  if (!isPlantProduct(product)) {
    return null
  }

  const compatiblePots = await getCompatiblePotsForPlant({
    plant: product,
    countryCode,
  })

  if (compatiblePots.length === 0) {
    return null
  }

  if (mode === "selector") {
    return (
      <div className="flex flex-col gap-4" data-testid="compatible-pots-selector">
        <div className="flex flex-col gap-1">
          <Heading level="h3" className="text-base font-semibold text-ui-fg-base">
            Pots compatibles
          </Heading>
          <Text className="text-sm text-ui-fg-subtle">
            Parfaits pour {product.title}
          </Text>
        </div>
        <PotSelector compatiblePots={compatiblePots} region={region} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6" data-testid="compatible-pots-display">
      <div className="flex flex-col gap-1">
        <Heading level="h2" className="text-xl font-semibold text-ui-fg-base">
          Pots compatibles
        </Heading>
        <Text className="text-sm text-ui-fg-subtle">
          Parfaits pour {product.title}
        </Text>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4">
        {compatiblePots.slice(0, 6).map((pot) => (
          <li key={pot.product.id}>
            <PotCard compatiblePot={pot} region={region} />
          </li>
        ))}
      </ul>
    </div>
  )
}
