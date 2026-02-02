"use client"

import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { MEGA_MENU_CONFIG, buildFilterUrl, MegaMenuCategory } from "@lib/config/mega-menu"
import { useState, useRef, useEffect } from "react"

type MegaMenuProps = {
  categoryHandle: string
  categoryName: string
  categoryIcon?: string
}

export default function MegaMenu({ categoryHandle, categoryName, categoryIcon }: MegaMenuProps) {
  const t = useTranslations("megaMenu")
  const tGroups = useTranslations("megaMenu.groups")
  const tItems = useTranslations("megaMenu.items")
  
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const config = MEGA_MENU_CONFIG[categoryHandle]

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200) // Increased delay
  }

  // Safe translation getters with fallbacks
  const getGroupLabel = (key: string) => {
    try {
      return tGroups(key as any)
    } catch {
      return key
    }
  }

  const getItemLabel = (key: string) => {
    try {
      return tItems(key as any)
    } catch {
      return key
    }
  }

  const getMainLabel = (key: string) => {
    try {
      return t(key as any)
    } catch {
      return key
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // If no mega menu config, render simple link
  if (!config) {
    return (
      <LocalizedClientLink
        href={`/category/${categoryHandle}`}
        className="flex items-center px-3 py-2 text-sm font-medium text-brand-oliveDark hover:text-brand-olive hover:bg-brand-beige/60 rounded-lg transition-all"
      >
        {categoryIcon && <span className="mr-1.5">{categoryIcon}</span>}
        <span>{categoryName}</span>
      </LocalizedClientLink>
    )
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger button */}
      <LocalizedClientLink
        href={`/category/${categoryHandle}`}
        className={`flex items-center px-3 py-2 text-sm font-medium transition-all rounded-lg ${
          isOpen 
            ? "text-brand-olive bg-brand-beige/60" 
            : "text-brand-oliveDark hover:text-brand-olive hover:bg-brand-beige/60"
        }`}
      >
        {categoryIcon && <span className="mr-1.5">{categoryIcon}</span>}
        <span>{categoryName}</span>
        <svg 
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </LocalizedClientLink>

      {/* Mega menu dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full pt-2 z-[100]">
          <div 
            className="bg-white border border-brand-beigeDark/30 rounded-xl shadow-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ minWidth: "700px" }}
          >
            <div className="flex gap-8">
              {/* Subcategory groups */}
              <div className="flex-1 grid grid-cols-4 gap-6">
                {config.groups.map((group) => (
                  <div key={group.key}>
                    <h3 className="text-xs font-bold text-brand-olive uppercase tracking-wider mb-3 pb-2 border-b border-brand-beige">
                      {getGroupLabel(group.key)}
                    </h3>
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li key={item.key}>
                          <LocalizedClientLink
                            href={buildFilterUrl(categoryHandle, item.filterKey, item.filterValue)}
                            className="flex items-center py-1.5 text-sm text-brand-oliveDark hover:text-brand-olive transition-colors group"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.icon && (
                              <span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                {item.icon}
                              </span>
                            )}
                            <span className="group-hover:translate-x-0.5 transition-transform">
                              {getItemLabel(item.key)}
                            </span>
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Featured section */}
              {config.featuredImage && (
                <div className="w-56 shrink-0">
                  <div className="relative h-40 rounded-lg overflow-hidden mb-3 bg-brand-beige">
                    {/* Placeholder for featured image */}
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      🌿
                    </div>
                  </div>
                  {config.featuredLink && (
                    <LocalizedClientLink
                      href={config.featuredLink.href}
                      className="text-sm font-medium text-brand-olive hover:text-brand-oliveDark transition-colors underline underline-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {getMainLabel(config.featuredLink.labelKey)}
                    </LocalizedClientLink>
                  )}
                </div>
              )}
            </div>

            {/* Shop all link */}
            <div className="mt-6 pt-4 border-t border-brand-beige">
              <LocalizedClientLink
                href={config.shopAllLink.href}
                className="inline-flex items-center text-sm font-semibold text-brand-olive hover:text-brand-oliveDark transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                {getMainLabel(config.shopAllLink.labelKey)}
                <svg 
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
