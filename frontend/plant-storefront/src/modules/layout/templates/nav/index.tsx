import { Suspense } from "react"
import { getTranslations } from "next-intl/server"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import LocaleSwitcher from "@modules/layout/components/locale-switcher"
import { listCategories } from "@lib/data/categories"

// Plant icons for categories
const CategoryIcon = ({ category }: { category: string }) => {
  const icons: Record<string, string> = {
    "plantes-interieur": "🌿",
    "plantes-exterieur": "🌳",
    "pots": "🪴",
    "accessoires": "✂️",
    "default": "🌱"
  }
  return <span className="mr-1.5">{icons[category] || icons.default}</span>
}

export default async function Nav() {
  const [regions, locales, currentLocale, t, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    getTranslations("nav"),
    listCategories(),
  ])

  const tCommon = await getTranslations("common")
  const rootCategories = categories.filter((cat) => !cat.parent_category)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Top promotional banner */}
      <div className="bg-brand-olive text-white text-center py-2 text-xs font-medium tracking-wide">
        <span className="hidden small:inline">🌱 {t("freeShipping") || "Livraison gratuite à partir de 100 TND"} 🌱</span>
        <span className="small:hidden">🌱 {t("freeShippingShort") || "Livraison gratuite dès 100 TND"}</span>
      </div>

      <header className="relative mx-auto bg-brand-cream border-b border-brand-beigeDark/30 shadow-sm">
        {/* Main navigation */}
        <nav className="content-container flex items-center justify-between w-full h-16 gap-4">
          {/* Left: Menu button */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center">
            <LocalizedClientLink
              href="/"
              className="group/logo flex items-center gap-2 transition-transform hover:scale-105"
              data-testid="nav-store-link"
            >
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold text-brand-olive tracking-tight">
                {t("storeName")}
              </span>
            </LocalizedClientLink>
          </div>

          {/* Search bar - desktop only */}
          <div className="flex-1 hidden medium:flex items-center justify-center px-8">
            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  className="w-full rounded-full border border-brand-beigeDark/50 bg-white px-4 py-2.5 pl-10 text-sm text-brand-oliveDark placeholder:text-brand-oliveDark/50 focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20 focus:outline-none transition-all"
                  aria-label={t("searchPlaceholder")}
                />
                <svg 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-oliveDark/50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-x-2 small:gap-x-4 h-full flex-1 basis-0 justify-end">
            {/* Language Switcher */}
            <div className="hidden small:flex">
              <LocaleSwitcher currentLocale={currentLocale || "fr"} />
            </div>

            {/* Account */}
            <LocalizedClientLink
              className="hidden small:flex items-center gap-1.5 text-brand-oliveDark hover:text-brand-olive transition-colors px-2 py-1 rounded-lg hover:bg-brand-beige/50"
              href="/account"
              data-testid="nav-account-link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">{tCommon("account")}</span>
            </LocalizedClientLink>

            {/* Cart */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center gap-1.5 text-brand-oliveDark hover:text-brand-olive transition-colors px-2 py-1 rounded-lg hover:bg-brand-beige/50"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="text-sm font-medium">{tCommon("cart")}</span>
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-brand-coral text-white rounded-full">0</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        {/* Category navigation */}
        <div className="border-t border-brand-beigeDark/20 bg-white/50">
          <div className="content-container flex items-center gap-1 small:gap-4 h-12 overflow-x-auto no-scrollbar">
            {rootCategories.map((category) => (
              <div key={category.id} className="relative group/cat shrink-0">
                <LocalizedClientLink
                  href={`/category/${category.handle}`}
                  className="flex items-center px-3 py-2 text-sm font-medium text-brand-oliveDark hover:text-brand-olive hover:bg-brand-beige/60 rounded-lg transition-all"
                >
                  <CategoryIcon category={category.handle || ""} />
                  <span>{category.name}</span>
                  {category.category_children?.length ? (
                    <svg className="w-4 h-4 ml-1 opacity-50 group-hover/cat:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : null}
                </LocalizedClientLink>

                {/* Dropdown for subcategories */}
                {category.category_children?.length ? (
                  <div className="absolute left-0 top-full pt-2 hidden group-hover/cat:block z-50">
                    <div className="w-64 rounded-xl bg-white border border-brand-beigeDark/30 shadow-xl p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="text-xs font-semibold text-brand-olive uppercase tracking-wider px-2 py-1 mb-2">
                        {category.name}
                      </div>
                      <ul className="space-y-1">
                        {category.category_children.map((child) => (
                          <li key={child.id}>
                            <LocalizedClientLink
                              href={`/category/${child.handle}`}
                              className="flex items-center px-3 py-2 text-sm text-brand-oliveDark hover:text-brand-olive hover:bg-brand-beige/60 rounded-lg transition-all"
                            >
                              <span className="mr-2 text-brand-olive/60">•</span>
                              {child.name}
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}

            {/* Right side links */}
            <div className="hidden medium:flex items-center gap-2 ml-auto">
              <LocalizedClientLink
                href="/store"
                className="flex items-center px-3 py-2 text-sm font-medium text-brand-oliveDark hover:text-brand-olive hover:bg-brand-beige/60 rounded-lg transition-all"
              >
                <span className="mr-1.5">✨</span>
                {t("newArrivals") || "Nouveautés"}
              </LocalizedClientLink>
              <button 
                className="flex items-center px-3 py-2 text-sm font-medium text-brand-coral hover:text-brand-coral/80 hover:bg-brand-coral/10 rounded-lg transition-all"
                type="button"
              >
                <span className="mr-1.5">💡</span>
                {t("inspiration")}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
