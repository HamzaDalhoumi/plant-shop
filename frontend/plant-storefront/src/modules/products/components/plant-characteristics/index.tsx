"use client"

import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "next-intl"

type PlantCharacteristicsProps = {
  product: HttpTypes.StoreProduct
}

type CharacteristicItem = {
  icon: React.ReactNode
  label: string
  value: string
}

// SVG Icons for characteristics
const DiameterIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="2 2" />
  </svg>
)

const HeightIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3" />
  </svg>
)

const SunIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)

const PartialSunIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    <path d="M15 12a3 3 0 01-6 0" fill="currentColor" opacity="0.3" />
  </svg>
)

const ShadeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 18a5 5 0 00-10 0" />
    <path d="M12 9V2M4.22 10.22l1.42 1.42M1 18h2M19.78 10.22l-1.42 1.42M23 18h-2" />
  </svg>
)

const CareIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 21c-4-4-8-6.5-8-10.5a8 8 0 0116 0c0 4-4 6.5-8 10.5z" />
    <path d="M12 13V8M12 8l-2 2M12 8l2 2" />
  </svg>
)

const AdvantageIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.5 5.7 21l2.3-7-6-4.6h7.6L12 2z" />
  </svg>
)

export default function PlantCharacteristics({ product }: PlantCharacteristicsProps) {
  const t = useTranslations("plantInfo")
  const metadata = product.metadata as Record<string, any> | undefined

  if (!metadata || metadata.environment === "pot") {
    return null
  }

  const characteristics: CharacteristicItem[] = []

  // Diameter
  if (metadata.diameter_cm) {
    characteristics.push({
      icon: <DiameterIcon />,
      label: t("diameter"),
      value: `${metadata.diameter_cm}cm`,
    })
  }

  // Height
  if (metadata.height_cm) {
    characteristics.push({
      icon: <HeightIcon />,
      label: t("height"),
      value: `${metadata.height_cm}cm`,
    })
  }

  // Light requirement
  if (metadata.light || metadata.sun_exposure) {
    const lightValue = metadata.light || metadata.sun_exposure
    const lightLabels: Record<string, { label: string; icon: React.ReactNode }> = {
      direct_sun: { label: t("lightValues.directSun"), icon: <SunIcon /> },
      indirect_light: { label: t("lightValues.indirectLight"), icon: <PartialSunIcon /> },
      partial_shade: { label: t("lightValues.partialShade"), icon: <PartialSunIcon /> },
      low_light: { label: t("lightValues.lowLight"), icon: <ShadeIcon /> },
      full_sun: { label: t("lightValues.fullSun"), icon: <SunIcon /> },
      shade: { label: t("lightValues.shade"), icon: <ShadeIcon /> },
    }
    const lightInfo = lightLabels[lightValue] || { label: lightValue, icon: <SunIcon /> }
    characteristics.push({
      icon: lightInfo.icon,
      label: t("light"),
      value: lightInfo.label,
    })
  }

  // Care level / Difficulty
  if (metadata.difficulty) {
    const difficultyLabels: Record<string, string> = {
      easy: t("careValues.easy"),
      medium: t("careValues.medium"),
      expert: t("careValues.expert"),
    }
    characteristics.push({
      icon: <CareIcon />,
      label: t("careLevel"),
      value: difficultyLabels[metadata.difficulty] || metadata.difficulty,
    })
  }

  // Advantages (air purifying, pet friendly)
  const advantages: string[] = []
  if (metadata.air_purifying) {
    advantages.push(t("advantagesValues.airPurifying"))
  }
  if (metadata.pet_friendly) {
    advantages.push(t("advantagesValues.petFriendly"))
  }

  if (advantages.length > 0) {
    characteristics.push({
      icon: <AdvantageIcon />,
      label: t("advantages"),
      value: advantages.join(", "),
    })
  }

  if (characteristics.length === 0) {
    return null
  }

  return (
    <div className="border-t border-ui-border-base pt-6 mt-6">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
        {characteristics.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center gap-2"
          >
            <div className="w-14 h-14 rounded-full bg-brand-cream/50 flex items-center justify-center text-brand-olive border border-brand-beigeDark/20">
              {item.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-ui-fg-subtle">{item.label}</span>
              <span className="text-xs font-medium text-ui-fg-base leading-tight">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
