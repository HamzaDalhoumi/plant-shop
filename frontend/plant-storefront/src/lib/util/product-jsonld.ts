import { HttpTypes } from "@medusajs/types"

export const buildProductJsonLd = (
  product: HttpTypes.StoreProduct,
  region: HttpTypes.StoreRegion,
  countryCode: string
) => {
  const cheapestVariant = product.variants?.reduce((cheapest, variant) => {
    const cheapestPrice =
      (cheapest as any)?.calculated_price?.calculated_amount ?? Infinity
    const variantPrice =
      (variant as any)?.calculated_price?.calculated_amount ?? Infinity
    return variantPrice < cheapestPrice ? variant : cheapest
  }, product.variants?.[0])

  const priceAmount =
    (cheapestVariant as any)?.calculated_price?.calculated_amount ?? 0

  const price = (priceAmount / 100).toFixed(2)
  const currency = region.currency_code?.toUpperCase() || "EUR"

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    sku: cheapestVariant?.sku,
    image: product.images?.map((image) => image.url) || [],
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price,
      availability: "https://schema.org/InStock",
      url: `/${countryCode}/product/${product.handle}`,
    },
  }
}
