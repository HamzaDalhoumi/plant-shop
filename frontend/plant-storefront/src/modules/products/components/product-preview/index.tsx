import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/product/${product.handle}`} className="group">
      <div 
        data-testid="product-wrapper"
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="relative overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-brand-olive/0 group-hover:bg-brand-olive/10 transition-colors duration-300" />
          {/* Quick view button on hover */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="block w-full text-center bg-white text-brand-oliveDark py-2 rounded-full text-sm font-medium shadow-md">
              Voir le produit
            </span>
          </div>
        </div>
        <div className="p-4">
          <Text 
            className="text-brand-oliveDark font-medium line-clamp-2 min-h-[2.5rem]" 
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="flex items-center justify-between mt-2">
            {cheapestPrice && (
              <div className="text-brand-olive font-semibold">
                <PreviewPrice price={cheapestPrice} />
              </div>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
