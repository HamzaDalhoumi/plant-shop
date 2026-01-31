import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Plant Shop - Plantes d'intérieur et d'extérieur en Tunisie",
  description:
    "Découvrez notre collection de plantes d'intérieur et d'extérieur. Livraison partout en Tunisie. Qualité garantie.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const [region, collectionsData, categories] = await Promise.all([
    getRegion(countryCode),
    listCollections({ fields: "id, handle, title" }),
    listCategories(),
  ])

  const { collections } = collectionsData
  const rootCategories = categories?.filter((cat) => !cat.parent_category) || []

  if (!collections || !region) {
    return null
  }

  return (
    <div className="bg-brand-cream">
      <Hero />
      
      {/* Categories Section */}
      {rootCategories.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="content-container">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-script text-3xl sm:text-4xl md:text-5xl text-brand-oliveDark italic mb-3">
                Explorer par catégorie
              </h2>
              <p className="text-brand-oliveDark/70 max-w-xl mx-auto">
                Trouvez la plante parfaite pour chaque espace de votre maison
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {rootCategories.slice(0, 4).map((category) => (
                <LocalizedClientLink
                  key={category.id}
                  href={`/category/${category.handle}`}
                  className="group relative overflow-hidden rounded-2xl bg-brand-beige aspect-square flex items-end p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-oliveDark/60 to-transparent z-10" />
                  <span className="relative z-20 text-white font-semibold text-base sm:text-lg group-hover:translate-x-1 transition-transform duration-300">
                    {category.name}
                    <svg className="inline-block w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-12 sm:py-16">
        <div className="content-container">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-script text-3xl sm:text-4xl md:text-5xl text-brand-oliveDark italic mb-3">
              Nos plantes populaires
            </h2>
            <p className="text-brand-oliveDark/70 max-w-xl mx-auto">
              Les favoris de nos clients, sélectionnés avec soin
            </p>
          </div>
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 bg-brand-beige">
        <div className="content-container">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-script text-3xl sm:text-4xl md:text-5xl text-brand-oliveDark italic mb-3">
              Pourquoi nous choisir ?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-olive/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-brand-oliveDark mb-2">Conseils d&apos;experts</h3>
              <p className="text-sm text-brand-oliveDark/70">Guides de soins détaillés pour chaque plante</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-olive/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-brand-oliveDark mb-2">Emballage soigné</h3>
              <p className="text-sm text-brand-oliveDark/70">Vos plantes arrivent en parfait état</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-olive/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-brand-oliveDark mb-2">Garantie 30 jours</h3>
              <p className="text-sm text-brand-oliveDark/70">Satisfait ou remboursé, sans questions</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-olive/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-brand-oliveDark mb-2">Support réactif</h3>
              <p className="text-sm text-brand-oliveDark/70">Une équipe à votre écoute 7j/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-brand-olive text-white">
        <div className="content-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-script text-3xl sm:text-4xl italic mb-3">
              Rejoignez notre communauté
            </h2>
            <p className="opacity-90 mb-6">
              Recevez nos conseils de jardinage et des offres exclusives
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-3 rounded-full text-brand-oliveDark focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-brand-gold hover:bg-brand-gold/90 text-white rounded-full font-medium transition-colors"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
