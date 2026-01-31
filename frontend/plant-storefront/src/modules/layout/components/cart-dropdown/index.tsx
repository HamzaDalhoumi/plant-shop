"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const t = useTranslations("cart")
  const tCommon = useTranslations("common")

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full outline-none">
          <LocalizedClientLink
            className="flex items-center gap-1.5 text-brand-oliveDark hover:text-brand-olive transition-colors px-2 py-1 rounded-lg hover:bg-brand-beige/50"
            href="/cart"
            data-testid="nav-cart-link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-sm font-medium hidden small:inline">{tCommon("cart")}</span>
            {totalItems > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 text-xs font-bold bg-brand-coral text-white rounded-full px-1.5">
                {totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+0.5rem)] right-0 w-[400px] z-50"
            data-testid="nav-cart-dropdown"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-brand-beigeDark/30 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-olive to-brand-olive/90 text-white px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛒</span>
                    <h3 className="text-lg font-semibold">{t("title")}</h3>
                  </div>
                  {totalItems > 0 && (
                    <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full font-medium">
                      {totalItems} {totalItems === 1 ? "article" : "articles"}
                    </span>
                  )}
                </div>
              </div>

              {cartState && cartState.items?.length ? (
                <>
                  {/* Cart items */}
                  <div className="max-h-[350px] overflow-y-auto">
                    <div className="divide-y divide-brand-beigeDark/20">
                      {cartState.items
                        .sort((a, b) => {
                          return (a.created_at ?? "") > (b.created_at ?? "")
                            ? -1
                            : 1
                        })
                        .map((item) => (
                          <div
                            className="p-4 hover:bg-brand-cream/30 transition-colors"
                            key={item.id}
                            data-testid="cart-item"
                          >
                            <div className="flex gap-4">
                              {/* Product image */}
                              <LocalizedClientLink
                                href={`/product/${item.product_handle}`}
                                className="shrink-0"
                              >
                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-brand-beigeDark/30 bg-brand-cream/50">
                                  <Thumbnail
                                    thumbnail={item.thumbnail}
                                    images={item.variant?.product?.images}
                                    size="square"
                                  />
                                </div>
                              </LocalizedClientLink>

                              {/* Product info */}
                              <div className="flex-1 min-w-0">
                                <LocalizedClientLink
                                  href={`/product/${item.product_handle}`}
                                  data-testid="product-link"
                                  className="block"
                                >
                                  <h4 className="text-sm font-semibold text-brand-oliveDark truncate hover:text-brand-olive transition-colors">
                                    {item.title}
                                  </h4>
                                </LocalizedClientLink>
                                
                                <div className="mt-1">
                                  <LineItemOptions
                                    variant={item.variant}
                                    data-testid="cart-item-variant"
                                    data-value={item.variant}
                                  />
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-brand-oliveDark/60">
                                      {t("quantity")}:
                                    </span>
                                    <span className="bg-brand-beige text-brand-oliveDark text-xs font-medium px-2 py-0.5 rounded">
                                      {item.quantity}
                                    </span>
                                  </div>
                                  <LineItemPrice
                                    item={item}
                                    style="tight"
                                    currencyCode={cartState.currency_code}
                                  />
                                </div>

                                <div className="mt-2">
                                  <DeleteButton
                                    id={item.id}
                                    className="text-xs text-brand-coral hover:text-brand-coral/80 transition-colors flex items-center gap-1"
                                    data-testid="cart-item-remove-button"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    {t("removeItem")}
                                  </DeleteButton>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Footer with totals */}
                  <div className="border-t border-brand-beigeDark/30 bg-brand-cream/50 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm font-medium text-brand-oliveDark">
                          {t("subtotal")}
                        </span>
                        <span className="text-xs text-brand-oliveDark/60 block">
                          {t("subtotalNote")}
                        </span>
                      </div>
                      <span
                        className="text-lg font-bold text-brand-olive"
                        data-testid="cart-subtotal"
                        data-value={subtotal}
                      >
                        {convertToLocale({
                          amount: subtotal,
                          currency_code: cartState.currency_code,
                        })}
                      </span>
                    </div>

                    <LocalizedClientLink href="/cart" passHref className="block">
                      <button
                        className="w-full bg-brand-olive hover:bg-brand-olive/90 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        data-testid="go-to-cart-button"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {t("goToCart")}
                      </button>
                    </LocalizedClientLink>
                  </div>
                </>
              ) : (
                /* Empty cart state */
                <div className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-brand-cream rounded-full flex items-center justify-center">
                    <span className="text-4xl">🌱</span>
                  </div>
                  <h4 className="text-lg font-semibold text-brand-oliveDark mb-2">
                    {t("empty")}
                  </h4>
                  <p className="text-sm text-brand-oliveDark/60 mb-6">
                    {t("emptyMessage")}
                  </p>
                  <LocalizedClientLink href="/store" className="block">
                    <button 
                      onClick={close}
                      className="w-full bg-brand-olive hover:bg-brand-olive/90 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>🌿</span>
                      {t("exploreProducts")}
                    </button>
                  </LocalizedClientLink>
                </div>
              )}
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
