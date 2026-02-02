import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { getCompatiblePotsForPlant } from "@lib/data/compatibility"
import { isPlantProduct } from "@lib/util/compatibility"
import { getTranslations } from "next-intl/server"
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
  const t = await getTranslations("products")
  
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
      <div 
        className="border border-ui-border-base rounded-lg p-4 bg-white"
        data-testid="compatible-pots-selector"
      >
        {/* Header with step number - PLNTS.com style */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-ui-fg-base flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-olive text-white text-xs flex items-center justify-center">2</span>
            {t("findMatchingPot") || "Trouver un pot assorti"}
          </h3>
          <button className="text-[11px] text-ui-fg-muted hover:text-ui-fg-base hover:underline">
            {t("plantSizeGuide") || "Guide des tailles"}
          </button>
        </div>
        <PotSelector compatiblePots={compatiblePots} region={region} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6" data-testid="compatible-pots-display">
      <div className="flex flex-col gap-1">
        <Heading level="h2" className="text-xl font-semibold text-ui-fg-base">
          {t("compatiblePots")}
        </Heading>
        <Text className="text-sm text-ui-fg-subtle">
          {t("perfectFor", { name: product.title })}
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
