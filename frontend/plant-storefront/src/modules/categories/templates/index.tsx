import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { FilterGroup, SelectedFilters } from "@lib/util/metadata-filters"

// Determine category type from handle
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

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  filters,
  selectedFilters,
  collections,
  tags,
  productCount = 0,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  filters: FilterGroup[]
  selectedFilters: SelectedFilters
  collections: HttpTypes.StoreCollection[]
  tags: HttpTypes.StoreProductTag[]
  productCount?: number
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  // Determine category type for filter customization
  const categoryType = getCategoryType(category.handle)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList
        sortBy={sort}
        filters={filters}
        selectedFilters={selectedFilters}
        collections={collections}
        tags={tags}
        categoryType={categoryType}
        productCount={productCount}
        data-testid="sort-by-container"
      />
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/category/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/category/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
            selectedFilters={selectedFilters}
          />
        </Suspense>
      </div>
    </div>
  )
}
