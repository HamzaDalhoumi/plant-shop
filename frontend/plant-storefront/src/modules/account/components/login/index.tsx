import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useTranslations } from "next-intl"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const t = useTranslations("auth")

  return (
    <div
      className="w-full max-w-md mx-auto"
      data-testid="login-page"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-brand-olive/10 rounded-full flex items-center justify-center">
          <span className="text-3xl">🌿</span>
        </div>
        <h1 className="text-2xl font-bold text-brand-oliveDark mb-2">
          {t("welcomeBack")}
        </h1>
        <p className="text-brand-oliveDark/60">
          {t("loginSubtitle")}
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-2xl border border-brand-beigeDark/30 shadow-sm p-6 sm:p-8">
        <form className="space-y-5" action={formAction}>
          <div>
            <label className="block text-sm font-medium text-brand-oliveDark mb-2">
              {t("email")}
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-brand-beigeDark/50 bg-white text-brand-oliveDark placeholder:text-brand-oliveDark/40 focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20 focus:outline-none transition-all"
              data-testid="email-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-oliveDark mb-2">
              {t("password")}
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-brand-beigeDark/50 bg-white text-brand-oliveDark placeholder:text-brand-oliveDark/40 focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20 focus:outline-none transition-all"
              data-testid="password-input"
            />
          </div>

          <ErrorMessage error={message} data-testid="login-error-message" />

          <SubmitButton 
            data-testid="sign-in-button" 
            className="w-full bg-brand-olive hover:bg-brand-olive/90 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {t("signIn")}
          </SubmitButton>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-beigeDark/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-brand-oliveDark/50">{t("or")}</span>
          </div>
        </div>

        {/* Register CTA */}
        <div className="text-center">
          <p className="text-sm text-brand-oliveDark/60 mb-3">
            {t("noAccount")}
          </p>
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="w-full border-2 border-brand-olive text-brand-olive hover:bg-brand-olive hover:text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            data-testid="register-button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            {t("createAccount")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
