import React from "react"
import { getTranslations } from "next-intl/server"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = async ({
  customer,
  children,
}) => {
  const t = await getTranslations("account")

  return (
    <div className="min-h-screen bg-brand-cream/30" data-testid="account-page">
      <div className="content-container py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-oliveDark flex items-center gap-3">
              <span className="text-3xl">👤</span>
              {t("myAccount")}
            </h1>
            <p className="text-brand-oliveDark/60 mt-1">
              {t("accountSubtitle")}
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 small:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <aside>
              {customer && <AccountNav customer={customer} />}
            </aside>

            {/* Main Content */}
            <main className="bg-white rounded-2xl border border-brand-beigeDark/30 shadow-sm p-6 sm:p-8">
              {children}
            </main>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-white rounded-2xl border border-brand-beigeDark/30 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-olive/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-oliveDark mb-1">
                    {t("needHelp")}
                  </h3>
                  <p className="text-brand-oliveDark/60 text-sm">
                    {t("helpDescription")}
                  </p>
                </div>
              </div>
              <LocalizedClientLink 
                href="/customer-service"
                className="inline-flex items-center gap-2 bg-brand-olive hover:bg-brand-olive/90 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("customerService")}
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
