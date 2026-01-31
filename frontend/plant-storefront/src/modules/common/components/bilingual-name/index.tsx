"use client"

import { clx } from "@medusajs/ui"

interface BilingualNameProps {
  /** Product title in format "French Name | Arabic Name" */
  title: string
  /** Optional subtitle (usually scientific name) */
  subtitle?: string | null
  /** Layout variant */
  variant?: "default" | "compact" | "card" | "hero"
  /** Additional class names */
  className?: string
  /** Show scientific name */
  showScientific?: boolean
}

/**
 * BilingualName - Displays plant names in French and Arabic elegantly
 * 
 * The component expects the title in format: "Nom Français | الاسم العربي"
 * It splits and displays both names in a visually appealing way.
 */
export function BilingualName({
  title,
  subtitle,
  variant = "default",
  className,
  showScientific = true,
}: BilingualNameProps) {
  // Split the bilingual title
  const parts = title.split(" | ")
  const nameFr = parts[0] || title
  const nameAr = parts[1] || ""

  if (variant === "compact") {
    return (
      <div className={clx("flex flex-col", className)}>
        <span className="text-sm font-medium text-ui-fg-base">{nameFr}</span>
        {nameAr && (
          <span className="text-xs text-ui-fg-muted font-arabic" dir="rtl">
            {nameAr}
          </span>
        )}
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div className={clx("space-y-1", className)}>
        {/* French name - main */}
        <h3 className="text-base font-semibold text-ui-fg-base line-clamp-1">
          {nameFr}
        </h3>
        
        {/* Arabic name - secondary */}
        {nameAr && (
          <p 
            className="text-sm text-emerald-700 font-arabic line-clamp-1" 
            dir="rtl"
          >
            {nameAr}
          </p>
        )}
        
        {/* Scientific name - tertiary */}
        {showScientific && subtitle && (
          <p className="text-xs text-ui-fg-muted italic">
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  if (variant === "hero") {
    return (
      <div className={clx("space-y-3", className)}>
        {/* French name - large */}
        <h1 className="text-3xl md:text-4xl font-bold text-ui-fg-base">
          {nameFr}
        </h1>
        
        {/* Arabic name - decorative */}
        {nameAr && (
          <p 
            className="text-2xl md:text-3xl text-emerald-600 font-arabic" 
            dir="rtl"
          >
            {nameAr}
          </p>
        )}
        
        {/* Scientific name */}
        {showScientific && subtitle && (
          <p className="text-lg text-ui-fg-muted italic">
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={clx("space-y-1.5", className)}>
      {/* French name */}
      <h2 className="text-xl font-semibold text-ui-fg-base">
        {nameFr}
      </h2>
      
      {/* Arabic name with elegant styling */}
      {nameAr && (
        <p 
          className="text-lg text-emerald-700 font-arabic" 
          dir="rtl"
        >
          {nameAr}
        </p>
      )}
      
      {/* Scientific name */}
      {showScientific && subtitle && (
        <p className="text-sm text-ui-fg-muted italic">
          {subtitle}
        </p>
      )}
    </div>
  )
}

/**
 * Get French name from bilingual title
 */
export function getFrenchName(title: string): string {
  const parts = title.split(" | ")
  return parts[0] || title
}

/**
 * Get Arabic name from bilingual title
 */
export function getArabicName(title: string): string {
  const parts = title.split(" | ")
  return parts[1] || ""
}

/**
 * Check if title is bilingual
 */
export function isBilingualTitle(title: string): boolean {
  return title.includes(" | ")
}

export default BilingualName
