"use client"

import { useState } from "react"
import { clx, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { CompatiblePot } from "@/types/compatibility"
import { getProductPrice } from "@lib/util/get-product-price"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  const handlePotSelect = (pot: CompatiblePot) => {
    if (selectedPot?.product.id === pot.product.id) {
      setSelectedPot(null)
      setSelectedVariantId(null)
    } else {
      setSelectedPot(pot)
      if (pot.matchingVariants.length > 0) {
        setSelectedVariantId(pot.matchingVariants[0].id)
      }
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

  return (
    <div className="flex flex-col gap-4">
      {/* Horizontal scrollable pot list - PLNTS.com style */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {compatiblePots.map((pot) => {
          const { variantPrice } = getProductPrice({
            product: pot.product,
            variantId: pot.matchingVariants[0]?.id,
          })
          const isSelected = selectedPot?.product.id === pot.product.id

          return (
            <button
              key={pot.product.id}
              onClick={() => handlePotSelect(pot)}
              className={clx(
                "flex-shrink-0 w-[72px] flex flex-col items-center p-1.5 rounded-lg border-2 transition-all",
                isSelected
                  ? "border-brand-olive bg-brand-cream/30"
                  : "border-transparent hover:border-ui-border-base bg-ui-bg-subtle"
              )}
            >
              <div className="w-14 h-14 relative mb-1">
                <Thumbnail
                  thumbnail={pot.product.thumbnail}
                  size="small"
                  className="!w-full !h-full object-contain rounded"
                />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-olive rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="text-[11px] font-medium text-ui-fg-base">
                {variantPrice?.calculated_price || ""}
              </span>
            </button>
          )
        })}

        {/* View all pots link */}
        <LocalizedClientLink
          href="/category/pots"
          className="flex-shrink-0 w-[72px] flex flex-col items-center justify-center p-1.5 rounded-lg border-2 border-dashed border-ui-border-base hover:border-brand-olive transition-all bg-ui-bg-subtle"
        >
          <div className="w-14 h-14 flex items-center justify-center">
            <svg className="w-6 h-6 text-ui-fg-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <span className="text-[10px] text-ui-fg-muted">{t("viewAllPots") || "Voir tout"}</span>
        </LocalizedClientLink>
      </div>

      {/* Selected pot - size selection if multiple variants */}
      {selectedPot && selectedPot.matchingVariants.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {selectedPot.matchingVariants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariantId(variant.id)}
              className={clx(
                "px-3 py-1 text-xs rounded-md border transition-all",
                selectedVariantId === variant.id
                  ? "border-brand-olive bg-brand-cream/50 text-brand-olive font-medium"
                  : "border-ui-border-base hover:border-ui-border-strong"
              )}
            >
              {variant.title}
            </button>
          ))}
        </div>
      )}

      {/* Selected pot action bar */}
      {selectedPot && (
        <div className="flex items-center justify-between pt-3 border-t border-ui-border-base">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <Thumbnail
                thumbnail={selectedPot.product.thumbnail}
                size="small"
                className="!w-full !h-full object-contain rounded"
              />
            </div>
            <div className="flex flex-col">
              <Text className="text-xs font-medium text-ui-fg-base truncate max-w-[120px]">
                {selectedPot.product.title}
              </Text>
              <Text className="text-[10px] text-ui-fg-subtle">
                {selectedPot.matchedSizes.join(", ")}
              </Text>
            </div>
          </div>
          <button
            onClick={handleAddPotToCart}
            disabled={!selectedVariantId || isAdding}
            className="px-3 py-1.5 bg-brand-olive text-white text-xs font-medium rounded-md hover:bg-brand-olive/90 disabled:opacity-50 transition-all flex items-center gap-1"
          >
            {isAdding ? (
              <span className="animate-spin">...</span>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {t("addPotToCart") || "Ajouter"}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
