"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Text } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import { CompatiblePot } from "@/types/compatibility"
import { getProductPrice } from "@lib/util/get-product-price"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Map variant size labels to standard sizes
const SIZE_MAPPING: Record<string, string> = {
  "S": "S", "PETIT": "S", "SMALL": "S",
  "M": "M", "MOYEN": "M", "MEDIUM": "M",
  "L": "L", "GRAND": "L", "LARGE": "L",
  "XL": "XL", "TRÈS GRAND": "XL", "TRES GRAND": "XL", "EXTRA LARGE": "XL",
  "XXL": "XL", // Map XXL to XL for pot compatibility
}

/**
 * Extract size from variant title (e.g., "Petit (12cm)" -> "S")
 */
function getVariantSize(variantTitle: string | null | undefined): string | null {
  if (!variantTitle) return null
  const normalized = variantTitle.toUpperCase()
  
  for (const [label, size] of Object.entries(SIZE_MAPPING)) {
    if (normalized.includes(label)) {
      return size
    }
  }
  return null
}

/**
 * Find the best matching pot variant for a given size
 */
function findPotVariantForSize(
  variants: HttpTypes.StoreProductVariant[],
  targetSize: string | null
): HttpTypes.StoreProductVariant | null {
  if (!variants.length) return null
  if (!targetSize) return variants[0] // Return first if no size specified
  
  // Try to find exact size match
  for (const variant of variants) {
    const variantSize = getVariantSize(variant.title)
    if (variantSize === targetSize) {
      return variant
    }
  }
  
  // Fallback to first variant
  return variants[0]
}

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  compatiblePots?: CompatiblePot[] | null
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  compatiblePots,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("products")

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // Pot selector state
  const [selectedPot, setSelectedPot] = useState<CompatiblePot | null>(null)
  const [selectedPotVariantId, setSelectedPotVariantId] = useState<string | null>(null)

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  // Get the current plant size from selected variant
  const selectedPlantSize = useMemo(() => {
    return getVariantSize(selectedVariant?.title)
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // When plant variant changes, update the pot variant to match the size
  useEffect(() => {
    if (selectedPot && selectedPlantSize) {
      const matchingPotVariant = findPotVariantForSize(
        selectedPot.matchingVariants,
        selectedPlantSize
      )
      if (matchingPotVariant && matchingPotVariant.id !== selectedPotVariantId) {
        setSelectedPotVariantId(matchingPotVariant.id)
      }
    }
  }, [selectedPlantSize, selectedPot])

  // Pot selection handlers - now auto-selects variant matching plant size
  const handlePotSelect = (pot: CompatiblePot) => {
    if (selectedPot?.product.id === pot.product.id) {
      setSelectedPot(null)
      setSelectedPotVariantId(null)
    } else {
      setSelectedPot(pot)
      // Find the pot variant that matches the selected plant size
      const matchingVariant = findPotVariantForSize(
        pot.matchingVariants,
        selectedPlantSize
      )
      if (matchingVariant) {
        setSelectedPotVariantId(matchingVariant.id)
      }
    }
  }

  // add the selected variant to the cart (and optionally the pot)
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    // Add main product
    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode,
    })

    // Add selected pot if any
    if (selectedPotVariantId) {
      await addToCart({
        variantId: selectedPotVariantId,
        quantity: quantity,
        countryCode,
      })
    }

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        {/* Step 1: Variant Selection */}
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-olive text-white text-xs flex items-center justify-center">1</span>
                <span className="text-sm font-medium">{t("selectVariant")}</span>
              </div>
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        {/* Step 2: Compatible Pots Selector */}
        {compatiblePots && compatiblePots.length > 0 && (
          <div className="border border-ui-border-base rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ui-fg-base flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-olive text-white text-xs flex items-center justify-center">2</span>
                {t("findMatchingPot") || "Trouver un pot assorti"}
              </h3>
              <button className="text-[11px] text-ui-fg-muted hover:text-ui-fg-base hover:underline">
                {t("plantSizeGuide") || "Guide des tailles"}
              </button>
            </div>

            {/* Horizontal scrollable pot list */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {compatiblePots.map((pot) => {
                const isSelected = selectedPot?.product.id === pot.product.id
                // Use selected pot variant ID if this pot is selected, otherwise find matching variant for plant size
                const displayVariantId = isSelected && selectedPotVariantId
                  ? selectedPotVariantId
                  : findPotVariantForSize(pot.matchingVariants, selectedPlantSize)?.id
                const { variantPrice } = getProductPrice({
                  product: pot.product,
                  variantId: displayVariantId,
                })

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
                href="/categories/pots"
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
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-ui-border-base">
                {selectedPot.matchingVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedPotVariantId(variant.id)}
                    className={clx(
                      "px-3 py-1 text-xs rounded-md border transition-all",
                      selectedPotVariantId === variant.id
                        ? "border-brand-olive bg-brand-cream/50 text-brand-olive font-medium"
                        : "border-ui-border-base hover:border-ui-border-strong"
                    )}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex flex-col gap-y-2 mt-2">
          <span className="text-sm font-medium text-ui-fg-base">
            {t("quantity") || "Quantité"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded border border-ui-border-base flex items-center justify-center hover:bg-ui-bg-subtle"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded border border-ui-border-base flex items-center justify-center hover:bg-ui-bg-subtle"
            >
              +
            </button>
          </div>
        </div>

        <ProductPrice product={product} variant={selectedVariant} quantity={quantity} />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? t("selectVariant")
            : !inStock || !isValidVariant
            ? t("outOfStock")
            : t("addToCart")}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
