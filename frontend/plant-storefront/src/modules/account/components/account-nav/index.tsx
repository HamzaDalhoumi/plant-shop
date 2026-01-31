"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

// Icons for account navigation
const NavIcon = ({ type }: { type: string }) => {
  const icons: Record<string, JSX.Element> = {
    overview: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    profile: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    addresses: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    orders: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  }
  return icons[type] || icons.overview
}

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const t = useTranslations("account")
  const tCommon = useTranslations("common")

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const navItems = [
    { label: t("overview"), href: "/account", icon: "overview", testId: "overview-link" },
    { label: t("profile"), href: "/account/profile", icon: "profile", testId: "profile-link" },
    { label: t("addresses"), href: "/account/addresses", icon: "addresses", testId: "addresses-link" },
    { label: t("orders"), href: "/account/orders", icon: "orders", testId: "orders-link" },
  ]

  return (
    <div>
      {/* Mobile Navigation */}
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-2 text-brand-olive px-4 py-3 bg-brand-cream/50 rounded-xl mb-4"
            data-testid="account-main-link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">{tCommon("back")}</span>
          </LocalizedClientLink>
        ) : (
          <div className="space-y-4">
            {/* User Greeting */}
            <div className="bg-gradient-to-r from-brand-olive to-brand-olive/90 text-white rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👋</span>
                </div>
                <div>
                  <p className="text-white/80 text-sm">{t("welcome")}</p>
                  <h2 className="text-xl font-bold">{customer?.first_name || t("guest")}</h2>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="bg-white rounded-2xl border border-brand-beigeDark/30 overflow-hidden divide-y divide-brand-beigeDark/20">
              {navItems.slice(1).map((item) => (
                <LocalizedClientLink
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between py-4 px-5 hover:bg-brand-cream/30 transition-colors"
                  data-testid={item.testId}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-brand-olive">
                      <NavIcon type={item.icon} />
                    </span>
                    <span className="text-brand-oliveDark font-medium">{item.label}</span>
                  </div>
                  <svg className="w-5 h-5 text-brand-oliveDark/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </LocalizedClientLink>
              ))}
              
              {/* Logout Button */}
              <button
                type="button"
                className="flex items-center justify-between py-4 px-5 w-full hover:bg-brand-coral/5 transition-colors text-brand-coral"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <div className="flex items-center gap-3">
                  <NavIcon type="logout" />
                  <span className="font-medium">{t("logout")}</span>
                </div>
                <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden small:block" data-testid="account-nav">
        <div className="bg-white rounded-2xl border border-brand-beigeDark/30 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-olive to-brand-olive/90 text-white p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white/80 text-xs">{t("myAccount")}</p>
                <h3 className="font-semibold">{customer?.first_name} {customer?.last_name}</h3>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <AccountNavLink
                    href={item.href}
                    route={route!}
                    icon={item.icon}
                    data-testid={item.testId}
                  >
                    {item.label}
                  </AccountNavLink>
                </li>
              ))}
              <li className="pt-2 border-t border-brand-beigeDark/20 mt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-brand-coral hover:bg-brand-coral/5 rounded-xl transition-colors"
                  data-testid="logout-button"
                >
                  <NavIcon type="logout" />
                  <span className="font-medium">{t("logout")}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  icon: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  icon,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
        active 
          ? "bg-brand-olive text-white shadow-md" 
          : "text-brand-oliveDark hover:bg-brand-cream/60"
      )}
      data-testid={dataTestId}
    >
      <NavIcon type={icon} />
      <span className="font-medium">{children}</span>
    </LocalizedClientLink>
  )
}

export default AccountNav
