import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"
import { defaultLocale, mapBackendLocale } from "./config"

const LOCALE_COOKIE_NAME = "_medusa_locale"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value

  const locale = mapBackendLocale(localeCookie)

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
