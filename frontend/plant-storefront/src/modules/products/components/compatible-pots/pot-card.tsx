import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { CompatiblePot } from "@/types/compatibility"
import { getCheapestVariant } from "@lib/util/compatibility"
import { getTranslations } from "next-intl/server"

type PotCardProps = {
  compatiblePot: CompatiblePot
  region: HttpTypes.StoreRegion
}

export default async function PotCard({ compatiblePot, region }: PotCardProps) {
  const t = await getTranslations("products")
  const { product, matchingVariants, matchedSizes } = compatiblePot

  const cheapestVariant = getCheapestVariant(matchingVariants)

  const { variantPrice } = getProductPrice({
    product,
    variantId: cheapestVariant?.id,
  })

  return (
    <LocalizedClientLink
      href={`/product/${product.handle}`}
      className="group"
      data-testid="pot-card"
    >
      <Thumbnail
        thumbnail={product.thumbnail}
        images={product.images}
        size="small"
        className="aspect-square"
      />
      <div className="flex flex-col gap-1 mt-3">
        <Text className="text-ui-fg-base font-medium text-sm">
          {product.title}
        </Text>
        <Text className="text-ui-fg-subtle text-xs">
          {matchedSizes.length > 1
            ? t("sizesLabel", { sizes: matchedSizes.join(", ") })
            : t("sizeLabel", { size: matchedSizes[0] })}
        </Text>
        <div className="flex items-center justify-between mt-1">
          {variantPrice && (
            <Text className="text-ui-fg-base text-sm font-semibold">
              {matchingVariants.length > 1 ? t("fromPrice") : ""}
              {variantPrice.calculated_price}
            </Text>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
