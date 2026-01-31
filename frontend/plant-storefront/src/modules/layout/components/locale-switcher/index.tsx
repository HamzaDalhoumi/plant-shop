"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { locales, isRtlLocale, type Locale } from "@i18n/config"

type LocaleSwitcherProps = {
  currentLocale: string
  variant?: "light" | "dark"
}

const LOCALE_COOKIE_NAME = "_medusa_locale"

const LocaleSwitcher = ({ currentLocale, variant = "light" }: LocaleSwitcherProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return
    
    startTransition(() => {
      // Set locale cookie - use the same cookie name as i18n/request.ts
      document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`
      
      // Refresh to apply the new locale
      router.refresh()
    })
  }

  const getStyles = (isActive: boolean) => {
    if (variant === "dark") {
      return isActive
        ? "font-semibold text-brand-gold"
        : "text-white/60 hover:text-brand-gold"
    }
    return isActive
      ? "font-semibold text-brand-olive"
      : "text-brand-oliveDark/60 hover:text-brand-olive"
  }

  const getSeparatorStyle = () => {
    return variant === "dark" ? "text-white/30" : "text-brand-oliveDark/30"
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center">
          <button
            onClick={() => switchLocale(locale)}
            disabled={isPending}
            className={`
              px-2 py-1 rounded transition-colors
              ${getStyles(currentLocale === locale)}
              ${isPending ? "opacity-50 cursor-wait" : ""}
              ${isRtlLocale(locale) ? "font-arabic" : ""}
            `}
            dir={isRtlLocale(locale) ? "rtl" : "ltr"}
          >
            {locale === "fr" ? "FR" : "عربي"}
          </button>
          {index < locales.length - 1 && (
            <span className={getSeparatorStyle()}>|</span>
          )}
        </span>
      ))}
    </div>
  )
}

export default LocaleSwitcher
