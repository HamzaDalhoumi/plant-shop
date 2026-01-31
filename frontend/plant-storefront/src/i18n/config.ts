export const locales = ["fr", "ar"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "fr"

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
}

export const rtlLocales: Locale[] = ["ar"]

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as Locale)
}

// Map backend locale codes to our translation file names
export function mapBackendLocale(backendLocale: string | undefined): Locale {
  if (!backendLocale) return defaultLocale

  const mapping: Record<string, Locale> = {
    "fr-FR": "fr",
    "fr-TN": "fr",
    fr: "fr",
    "ar-TN": "ar",
    ar: "ar",
  }

  return mapping[backendLocale] || defaultLocale
}
