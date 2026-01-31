import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

// Determine category type from collection handle
const getCategoryType = (handle: string): "indoor" | "outdoor" | "pots" | "all" => {
  const lowerHandle = handle.toLowerCase()
  if (lowerHandle.includes("indoor") || lowerHandle.includes("interieur") || lowerHandle.includes("intérieur")) {
    return "indoor"
  }
  if (lowerHandle.includes("outdoor") || lowerHandle.includes("exterieur") || lowerHandle.includes("extérieur")) {
    return "outdoor"
  }
  if (lowerHandle.includes("pot") || lowerHandle.includes("jardiniere") || lowerHandle.includes("jardinière")) {
    return "pots"
  }
  return "all"
}

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categoryType = getCategoryType(collection.handle)

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList 
        sortBy={sort}
        filters={[]}
        selectedFilters={{}}
        collections={[]}
        tags={[]}
        categoryType={categoryType}
      />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{collection.title}</h1>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
