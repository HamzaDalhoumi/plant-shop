"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import { useTranslations } from "next-intl"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LocaleSwitcher from "../locale-switcher"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

// Menu icons mapping
const MenuIcon = ({ icon }: { icon: string }) => {
  const icons: Record<string, JSX.Element> = {
    home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    store: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16m-7 5h7" /></svg>,
    account: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    cart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  }
  return icons[icon] || <span className="w-5 h-5 flex items-center justify-center">🌿</span>
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const t = useTranslations("common")
  const tNav = useTranslations("nav")
  const tFooter = useTranslations("footer")

  const SideMenuItems = [
    { label: t("home"), href: "/", icon: "home" },
    { label: t("store"), href: "/store", icon: "store" },
    { label: t("account"), href: "/account", icon: "account" },
    { label: t("cart"), href: "/cart", icon: "cart" },
  ]

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center gap-2 transition-all ease-out duration-200 focus:outline-none text-brand-oliveDark hover:text-brand-olive px-2 py-1 rounded-lg hover:bg-brand-beige/50"
                >
                  {open ? (
                    <XMark className="w-5 h-5" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{t("menu")}</span>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="-translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition ease-in duration-200"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="-translate-x-full opacity-0"
              >
                <PopoverPanel className="fixed left-0 top-0 h-full w-full max-w-xs z-[51] shadow-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-white overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-olive to-brand-olive/90 text-white px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🌿</span>
                          <span className="text-xl font-bold">{tNav("storeName")}</span>
                        </div>
                        <button 
                          data-testid="close-menu-button" 
                          onClick={close}
                          className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                          <XMark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Language Switcher - Mobile */}
                    <div className="px-6 py-4 border-b border-brand-beigeDark/20 bg-brand-cream/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brand-oliveDark/60">{t("language")}</span>
                        <LocaleSwitcher currentLocale={currentLocale || "fr"} />
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto py-4">
                      <ul className="space-y-1 px-3">
                        {SideMenuItems.map((item) => (
                          <li key={item.label}>
                            <LocalizedClientLink
                              href={item.href}
                              className="flex items-center gap-4 px-4 py-3.5 text-brand-oliveDark hover:text-brand-olive hover:bg-brand-beige/60 rounded-xl transition-all group"
                              onClick={close}
                              data-testid={`${item.label.toLowerCase()}-link`}
                            >
                              <span className="text-brand-olive/70 group-hover:text-brand-olive transition-colors">
                                <MenuIcon icon={item.icon} />
                              </span>
                              <span className="text-base font-medium">{item.label}</span>
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>

                      {/* Categories Section */}
                      <div className="mt-6 px-6">
                        <h3 className="text-xs font-semibold text-brand-oliveDark/50 uppercase tracking-wider mb-3">
                          Catégories
                        </h3>
                        <ul className="space-y-1">
                          <li>
                            <LocalizedClientLink
                              href="/category/plantes-interieur"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-oliveDark hover:text-brand-olive hover:bg-brand-beige/60 rounded-lg transition-all"
                              onClick={close}
                            >
                              <span>🌿</span>
                              <span>{tNav("indoorPlants")}</span>
                            </LocalizedClientLink>
                          </li>
                          <li>
                            <LocalizedClientLink
                              href="/category/plantes-exterieur"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-oliveDark hover:text-brand-olive hover:bg-brand-beige/60 rounded-lg transition-all"
                              onClick={close}
                            >
                              <span>🌳</span>
                              <span>{tNav("outdoorPlants")}</span>
                            </LocalizedClientLink>
                          </li>
                          <li>
                            <LocalizedClientLink
                              href="/category/pots"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-oliveDark hover:text-brand-olive hover:bg-brand-beige/60 rounded-lg transition-all"
                              onClick={close}
                            >
                              <span>🪴</span>
                              <span>{tNav("pots")}</span>
                            </LocalizedClientLink>
                          </li>
                        </ul>
                      </div>
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-brand-beigeDark/20 bg-brand-cream/30 p-6">
                      <div
                        className="mb-4"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                      </div>
                      <p className="text-xs text-brand-oliveDark/50 text-center">
                        © {new Date().getFullYear()} {tNav("storeName")}. {tFooter("copyright")}
                      </p>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
