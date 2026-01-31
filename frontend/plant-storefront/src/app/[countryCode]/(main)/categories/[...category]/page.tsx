import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listProducts } from "@lib/data/products"
import { buildMetadataFilters, parseSelectedFilters } from "@lib/util/metadata-filters"
import { listCollections } from "@lib/data/collections"
import { listTags } from "@lib/data/tags"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const title = productCategory.name + " | Plant Shop"

    const description = productCategory.description ?? `${title} category.`

    return {
      title: `${title}`,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const { response } = await listProducts({
    countryCode: params.countryCode,
    queryParams: {
      limit: 100,
      category_id: [productCategory.id],
    },
  })

  const filters = buildMetadataFilters(response.products)
  const selectedFilters = parseSelectedFilters(searchParams)

  const [{ collections }, { tags }] = await Promise.all([
    listCollections(),
    listTags(),
  ])

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      filters={filters}
      selectedFilters={selectedFilters}
      collections={collections}
      tags={tags}
    />
  )
}
