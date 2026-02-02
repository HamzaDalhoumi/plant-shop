import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { searchProducts } from "@lib/data/search"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Recherche",
  description: "Rechercher des plantes et produits",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const query = searchParams.q || ""
  const t = await getTranslations("search")

  const [{ products, count }, region] = await Promise.all([
    query
      ? searchProducts({
          query,
          countryCode: params.countryCode,
          limit: 50,
        })
      : Promise.resolve({ products: [], count: 0 }),
    getRegion(params.countryCode),
  ])

  if (!region) {
    return <div>Region not found</div>
  }

  return (
    <div className="content-container py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-brand-oliveDark mb-2">
          {query ? t("showingResultsFor", { query }) : t("searchResults")}
        </h1>
        {query && (
          <p className="text-ui-fg-muted">
            {count} {count === 1 ? "résultat" : "résultats"} trouvé{count > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* No query state */}
      {!query && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-medium text-brand-oliveDark mb-2">
            {t("searchPlaceholder") || "Que recherchez-vous ?"}
          </h2>
          <p className="text-ui-fg-muted mb-6">
            Utilisez la barre de recherche pour trouver vos plantes préférées
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Monstera", "Ficus", "Aloe", "Cactus", "Orchidée"].map((term) => (
              <LocalizedClientLink
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-4 py-2 bg-brand-beige hover:bg-brand-cream text-brand-oliveDark rounded-full text-sm transition-colors"
              >
                {term}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      )}

      {/* No results state */}
      {query && products.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌵</div>
          <h2 className="text-xl font-medium text-brand-oliveDark mb-2">
            {t("noResults", { query })}
          </h2>
          <p className="text-ui-fg-muted mb-6">
            Essayez avec d&apos;autres mots-clés ou parcourez nos catégories
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <LocalizedClientLink
              href="/category/indoor-plants"
              className="px-4 py-2 bg-brand-olive text-white rounded-full text-sm hover:bg-brand-oliveDark transition-colors"
            >
              🌿 Plantes d&apos;intérieur
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/category/outdoor-plants"
              className="px-4 py-2 bg-brand-olive text-white rounded-full text-sm hover:bg-brand-oliveDark transition-colors"
            >
              🌳 Plantes d&apos;extérieur
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="px-4 py-2 border border-brand-olive text-brand-olive rounded-full text-sm hover:bg-brand-cream transition-colors"
            >
              Voir tout
            </LocalizedClientLink>
          </div>
        </div>
      )}

      {/* Results grid */}
      {products.length > 0 && (
        <ul
          className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8"
          data-testid="products-list"
        >
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
