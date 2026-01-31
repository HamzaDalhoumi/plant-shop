"use client"

import { useState } from "react"
import { Button, clx, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { CompatiblePot } from "@/types/compatibility"
import { getProductPrice } from "@lib/util/get-product-price"
import Thumbnail from "@modules/products/components/thumbnail"

type PotSelectorProps = {
  compatiblePots: CompatiblePot[]
  region: HttpTypes.StoreRegion
}

export default function PotSelector({
  compatiblePots,
  region,
}: PotSelectorProps) {
  const t = useTranslations("products")
  const [selectedPot, setSelectedPot] = useState<CompatiblePot | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  )
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  const handlePotSelect = (pot: CompatiblePot) => {
    setSelectedPot(pot)
    if (pot.matchingVariants.length > 0) {
      setSelectedVariantId(pot.matchingVariants[0].id)
    }
  }

  const handleAddPotToCart = async () => {
    if (!selectedVariantId) return

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariantId,
        quantity: 1,
        countryCode,
      })
    } finally {
      setIsAdding(false)
    }
  }

  const { variantPrice } = selectedPot
    ? getProductPrice({
        product: selectedPot.product,
        variantId: selectedVariantId || undefined,
      })
    : { variantPrice: null }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {compatiblePots.map((pot) => (
          <button
            key={pot.product.id}
            onClick={() => handlePotSelect(pot)}
            className={clx(
              "flex-shrink-0 w-24 p-2 rounded-lg border transition-all text-left",
              selectedPot?.product.id === pot.product.id
                ? "border-ui-border-interactive bg-ui-bg-subtle-hover"
                : "border-ui-border-base hover:border-ui-border-strong"
            )}
          >
            <Thumbnail
              thumbnail={pot.product.thumbnail}
              size="small"
              className="aspect-square w-full !w-full"
            />
            <Text className="text-xs mt-1 text-center truncate block">
              {pot.product.title}
            </Text>
          </button>
        ))}
      </div>

      {selectedPot && selectedPot.matchingVariants.length > 1 && (
        <div className="flex flex-col gap-2">
          <Text className="text-sm text-ui-fg-subtle">
            {t("selectSize")}
          </Text>
          <div className="flex flex-wrap gap-2">
            {selectedPot.matchingVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                className={clx(
                  "px-3 py-1.5 text-sm rounded-lg border transition-all",
                  selectedVariantId === variant.id
                    ? "border-ui-border-interactive bg-ui-bg-subtle-hover"
                    : "border-ui-border-base hover:border-ui-border-strong"
                )}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedPot && variantPrice && (
        <div className="flex items-center justify-between pt-3 border-t border-ui-border-base">
          <Text className="text-sm text-ui-fg-base">
            {selectedPot.product.title}
          </Text>
          <Text className="font-semibold">{variantPrice.calculated_price}</Text>
        </div>
      )}

      <Button
        onClick={handleAddPotToCart}
        disabled={!selectedVariantId || isAdding}
        variant="secondary"
        className="w-full"
        isLoading={isAdding}
      >
        {selectedPot ? t("addPotToCart") : t("selectAPot")}
      </Button>
    </div>
  )
}
