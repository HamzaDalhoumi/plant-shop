"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  const tAccount = useTranslations("account")
  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          {tAccount("alreadyMember")}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          {tAccount("signInMessage")}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10" data-testid="sign-in-button">
            {tAccount("signIn")}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
