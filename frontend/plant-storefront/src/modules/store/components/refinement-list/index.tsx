"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState, useEffect, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import { FilterGroup, SelectedFilters, getColorHex, QUICK_FILTERS } from "@lib/util/metadata-filters"
import { useTranslations } from "next-intl"

import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
  filters: FilterGroup[]
  selectedFilters: SelectedFilters
  collections: HttpTypes.StoreCollection[]
  tags: HttpTypes.StoreProductTag[]
  categoryType?: "indoor" | "outdoor" | "pots" | "all"
  productCount?: number
}

// Icons for filter groups
const FilterIcons: Record<string, JSX.Element> = {
  size: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  water_needs: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a8 8 0 01-8-8c0-4 4-10 8-10s8 6 8 10a8 8 0 01-8 8z" />
    </svg>
  ),
  light: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  sun_exposure: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  color: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  family: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  placement: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  climate: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  season: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  frost_resistant: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m-6-3l6-6 6 6M6 9l6 6 6-6" />
    </svg>
  ),
  difficulty: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  features: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  height_cm: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
  ),
  diameter_cm: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6" />
    </svg>
  ),
  price: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  material: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  drainage: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  style: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  shape: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  rarity: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  hanging: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  collection: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  tag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
}

const getFilterIcon = (key: string) => {
  return FilterIcons[key] || (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  )
}

// Category title keys for translation
const CATEGORY_TITLE_KEYS: Record<string, string> = {
  indoor: "indoor",
  outdoor: "outdoor", 
  pots: "pots",
  all: "all",
}

const RefinementList = ({
  sortBy,
  filters,
  selectedFilters,
  collections,
  tags,
  categoryType = "all",
  productCount = 0,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filterContentRef = useRef<HTMLDivElement>(null)
  
  // Translations
  const t = useTranslations("filters")
  const tCategories = useTranslations("categories")
  const tCommon = useTranslations("common")

  // Determine default expanded groups based on category
  const getDefaultExpanded = useCallback(() => {
    if (categoryType === "indoor") {
      return new Set(["difficulty", "light", "features", "size"])
    }
    if (categoryType === "outdoor") {
      return new Set(["sun_exposure", "climate", "frost_resistant", "season"])
    }
    if (categoryType === "pots") {
      return new Set(["material", "drainage", "diameter_cm"])
    }
    return new Set(["size", "difficulty", "light"])
  }, [categoryType])

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(getDefaultExpanded)
  const [showAllOptions, setShowAllOptions] = useState<Set<string>>(new Set())
  const [rangeValues, setRangeValues] = useState<Record<string, { min: string; max: string }>>({})
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"filters" | "sort">("filters")

  // Initialize range values from URL
  useEffect(() => {
    const ranges: Record<string, { min: string; max: string }> = {}
    filters.forEach((group) => {
      if (group.type === "range") {
        ranges[group.key] = {
          min: searchParams.get(`${group.key}_min`) || "",
          max: searchParams.get(`${group.key}_max`) || "",
        }
      }
    })
    setRangeValues(ranges)
  }, [filters, searchParams])

  // Reset expanded groups when category changes
  useEffect(() => {
    setExpandedGroups(getDefaultExpanded())
  }, [categoryType, getDefaultExpanded])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const toggleFilterValue = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    const existing = params.get(key)
    const currentValues = existing ? existing.split(",").filter(Boolean) : []
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((entry) => entry !== value)
      : [...currentValues, value]

    if (nextValues.length === 0) {
      params.delete(key)
    } else {
      params.set(key, nextValues.join(","))
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const applyRangeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams)
    const { min, max } = rangeValues[key] || {}

    if (min) params.set(`${key}_min`, min)
    else params.delete(`${key}_min`)
    if (max) params.set(`${key}_max`, max)
    else params.delete(`${key}_max`)

    router.push(`${pathname}?${params.toString()}`)
  }

  const updateRangeValue = (key: string, type: "min" | "max", value: string) => {
    setRangeValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], [type]: value },
    }))
  }

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleShowAll = (key: string) => {
    setShowAllOptions((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const clearAllFilters = () => {
    router.push(pathname)
  }

  const clearFilterGroup = (key: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(key)
    params.delete(`${key}_min`)
    params.delete(`${key}_max`)
    router.push(`${pathname}?${params.toString()}`)
  }

  const filterGroups = useMemo(() => {
    const collectionGroup: FilterGroup | null = collections?.length
      ? {
          key: "collection",
          label: "Collections",
          labelFr: "Collections",
          type: "checkbox" as const,
          options: collections.map((collection) => ({
            value: collection.handle,
            label: collection.title,
            count: 0,
          })),
        }
      : null

    const tagGroup: FilterGroup | null = tags?.length
      ? {
          key: "tag",
          label: "Tags",
          labelFr: "Étiquettes",
          type: "checkbox" as const,
          options: tags.map((tag) => ({
            value: tag.value,
            label: tag.value,
            count: 0,
          })),
        }
      : null

    return [...filters, collectionGroup, tagGroup].filter(
      (group): group is FilterGroup => Boolean(group) && group.options.length > 0
    )
  }, [collections, filters, tags])

  const totalSelected = Object.values(selectedFilters).flat().length

  // Get quick filters for current category
  const quickFilters = useMemo(() => {
    return QUICK_FILTERS[categoryType as keyof typeof QUICK_FILTERS] || []
  }, [categoryType])

  // Get label for a filter value
  const getFilterLabel = (key: string, value: string) => {
    const group = filterGroups.find(g => g.key === key)
    const option = group?.options.find(o => o.value === value)
    return option?.label || value
  }

  // Quick Filter Chips Component
  const QuickFilterChips = () => {
    if (quickFilters.length === 0) return null

    return (
      <div className="mb-4">
        <p className="text-xs font-semibold text-brand-oliveDark mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t("filterTitle")}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => {
            const isActive = selectedFilters[filter.key]?.includes(filter.value)
            return (
              <button
                key={`${filter.key}-${filter.value}`}
                onClick={() => toggleFilterValue(filter.key, filter.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border-2 transition-all duration-200 ${
                  isActive
                    ? "bg-brand-olive text-white border-brand-olive shadow-md transform scale-105"
                    : "bg-white text-brand-oliveDark border-brand-beigeDark hover:border-brand-olive hover:bg-brand-beige"
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Active Filters Summary Component  
  const ActiveFiltersSummary = () => {
    if (totalSelected === 0) return null

    return (
      <div className="mb-4 p-3 bg-gradient-to-r from-brand-olive/5 to-brand-beige rounded-xl border border-brand-olive/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-brand-oliveDark flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-brand-olive text-white text-xs font-bold rounded-full">
              {totalSelected}
            </span>
            {totalSelected} {totalSelected > 1 ? t("values.size.M") : t("values.size.S")}
          </span>
          <button
            onClick={clearAllFilters}
            className="text-xs font-medium text-brand-coral hover:text-brand-coral/80 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-brand-coral/10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t("clearAll")}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {Object.entries(selectedFilters).map(([key, values]) =>
            values.map((value) => (
              <button
                key={`${key}-${value}`}
                onClick={() => toggleFilterValue(key, value)}
                className="group inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-brand-olive text-xs font-medium rounded-full border border-brand-olive/30 hover:bg-brand-olive hover:text-white hover:border-brand-olive transition-all duration-200"
              >
                <span className="max-w-[120px] truncate">{getFilterLabel(key, value)}</span>
                <svg className="w-3 h-3 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))
          )}
        </div>
      </div>
    )
  }

  // Range Filter Component
  const RangeFilter = ({ group }: { group: FilterGroup }) => {
    const hasValues = rangeValues[group.key]?.min || rangeValues[group.key]?.max
    const isApplied = searchParams.get(`${group.key}_min`) || searchParams.get(`${group.key}_max`)
    
    return (
      <div className="space-y-3 px-1">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-[10px] text-brand-oliveDark/60 uppercase tracking-wider mb-1.5 block font-medium">
              Min
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder={String(group.min || 0)}
                className="w-full rounded-xl border-2 border-brand-beigeDark bg-white px-3 py-2.5 text-sm focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20 transition-all placeholder:text-brand-oliveDark/30"
                value={rangeValues[group.key]?.min || ""}
                onChange={(e) => updateRangeValue(group.key, "min", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyRangeFilter(group.key)}
              />
            </div>
          </div>
          <div className="flex items-center pt-5">
            <div className="w-4 h-0.5 bg-brand-oliveDark/20 rounded-full"></div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-brand-oliveDark/60 uppercase tracking-wider mb-1.5 block font-medium">
              Max
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder={String(group.max || 999)}
                className="w-full rounded-xl border-2 border-brand-beigeDark bg-white px-3 py-2.5 text-sm focus:border-brand-olive focus:ring-2 focus:ring-brand-olive/20 transition-all placeholder:text-brand-oliveDark/30"
                value={rangeValues[group.key]?.max || ""}
                onChange={(e) => updateRangeValue(group.key, "max", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyRangeFilter(group.key)}
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={() => applyRangeFilter(group.key)}
          disabled={!hasValues}
          className={`w-full py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
            hasValues
              ? "bg-brand-olive text-white hover:bg-brand-oliveDark shadow-sm"
              : "bg-brand-beige text-brand-oliveDark/40 cursor-not-allowed"
          }`}
        >
          {isApplied ? "Mettre à jour" : "Appliquer"}
        </button>
        
        {group.min !== undefined && group.max !== undefined && (
          <p className="text-[10px] text-brand-oliveDark/50 text-center flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Plage disponible: {group.min} - {group.max} {group.key.includes("cm") ? "cm" : group.key === "price" ? "TND" : ""}
          </p>
        )}
      </div>
    )
  }

  // Color Filter Component
  const ColorFilter = ({ group }: { group: FilterGroup }) => {
    const showAll = showAllOptions.has(group.key)
    const maxVisible = 8
    const hasMore = group.options.length > maxVisible
    const displayOptions = showAll ? group.options : group.options.slice(0, maxVisible)

    return (
      <div className="space-y-2 px-1">
        <div className="grid grid-cols-2 gap-2">
          {displayOptions.map((option) => {
            const selected = selectedFilters[group.key]?.includes(option.value) ?? false
            const colorHex = getColorHex(option.value)
            const isGradient = colorHex.includes("gradient")
            
            return (
              <button
                key={`${group.key}-${option.value}`}
                onClick={() => toggleFilterValue(group.key, option.value)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs border-2 transition-all duration-200 ${
                  selected
                    ? "border-brand-olive bg-brand-olive/10 shadow-md"
                    : "border-brand-beigeDark hover:border-brand-olive/50 hover:bg-brand-beige"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex-shrink-0 shadow-inner ${
                    selected ? "ring-2 ring-brand-olive ring-offset-1" : ""
                  } ${option.value === "white" ? "border border-gray-200" : ""}`}
                  style={{ 
                    background: isGradient ? colorHex : undefined,
                    backgroundColor: !isGradient ? colorHex : undefined 
                  }}
                />
                <span className={`flex-1 text-left truncate ${selected ? "text-brand-olive font-semibold" : "text-brand-oliveDark"}`}>
                  {option.label}
                </span>
                {option.count > 0 && (
                  <span className={`text-[10px] ${selected ? "text-brand-olive" : "text-brand-oliveDark/40"}`}>
                    {option.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        
        {hasMore && (
          <button
            onClick={() => toggleShowAll(group.key)}
            className="flex items-center justify-center gap-1 w-full text-xs text-brand-olive hover:text-brand-olive/80 font-medium py-2 transition-colors"
          >
            {showAll ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {t("showLess")}
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {t("showAll", { count: group.options.length })}
              </>
            )}
          </button>
        )}
      </div>
    )
  }

  // Checkbox Filter Component
  const CheckboxFilter = ({ group }: { group: FilterGroup }) => {
    const showAll = showAllOptions.has(group.key)
    const maxVisible = 5
    const hasMore = group.options.length > maxVisible
    const displayOptions = showAll ? group.options : group.options.slice(0, maxVisible)

    return (
      <div className="space-y-1 px-1">
        {displayOptions.map((option) => {
          const selected = selectedFilters[group.key]?.includes(option.value) ?? false
          
          return (
            <label
              key={`${group.key}-${option.value}`}
              className={`flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selected 
                  ? "bg-brand-olive/10 shadow-sm" 
                  : "hover:bg-brand-beige"
              }`}
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={selected}
                  onChange={() => toggleFilterValue(group.key, option.value)}
                />
                <div
                  className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                    selected
                      ? "bg-brand-olive border-brand-olive"
                      : "border-brand-beigeDark peer-hover:border-brand-olive/50"
                  }`}
                >
                  {selected && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className={`flex-1 text-sm ${selected ? "text-brand-olive font-semibold" : "text-brand-oliveDark"}`}>
                {option.label}
              </span>
              {option.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selected 
                    ? "bg-brand-olive/20 text-brand-olive font-medium" 
                    : "bg-brand-beige text-brand-oliveDark/50"
                }`}>
                  {option.count}
                </span>
              )}
            </label>
          )
        })}

        {hasMore && (
          <button
            onClick={() => toggleShowAll(group.key)}
            className="flex items-center gap-1 text-xs text-brand-olive hover:text-brand-olive/80 font-medium py-2 ml-2 transition-colors"
          >
            {showAll ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {t("showLess")}
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {t("showAll", { count: group.options.length })}
              </>
            )}
          </button>
        )}
      </div>
    )
  }

  // Filter Group Header Component - Fixed to avoid nested buttons
  const FilterGroupHeader = ({ group, selectedCount }: { group: FilterGroup; selectedCount: number }) => {
    const isExpanded = expandedGroups.has(group.key)
    
    // Get translated label for the filter group
    const getFilterLabel = (key: string, fallback: string) => {
      const translationMap: Record<string, string> = {
        size: t("size"),
        water_needs: t("water"),
        light: t("light"),
        sun_exposure: t("light"),
        color: t("color"),
        family: t("family"),
        placement: t("standingOrHanging"),
        climate: t("characteristics"),
        season: t("characteristics"),
        frost_resistant: t("characteristics"),
        difficulty: t("careLevel"),
        features: t("characteristics"),
        height_cm: t("height"),
        diameter_cm: t("diameter"),
        price: t("price"),
        material: t("material"),
        drainage: t("characteristics"),
        style: t("style"),
        shape: t("shape"),
        rarity: t("characteristics"),
        hanging: t("standingOrHanging"),
        collection: "Collections",
        tag: t("characteristics"),
        room: t("room"),
      }
      return translationMap[key] || fallback
    }
    
    return (
      <div className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-brand-oliveDark hover:text-brand-olive transition-colors group">
        <button
          type="button"
          onClick={() => toggleGroup(group.key)}
          className="flex-1 flex items-center gap-2.5 text-left"
        >
          <span className={`p-1.5 rounded-lg transition-colors ${
            selectedCount > 0 ? "bg-brand-olive/10 text-brand-olive" : "bg-brand-beige text-brand-olive/70 group-hover:text-brand-olive"
          }`}>
            {getFilterIcon(group.key)}
          </span>
          <span>{getFilterLabel(group.key, group.labelFr)}</span>
          {selectedCount > 0 && (
            <span className="bg-brand-olive text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
              {selectedCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                clearFilterGroup(group.key)
              }}
              className="text-[10px] text-brand-oliveDark/50 hover:text-brand-coral transition-colors px-2 py-1 rounded hover:bg-brand-coral/10"
            >
              {t("clearAll")}
            </button>
          )}
          <button
            type="button"
            onClick={() => toggleGroup(group.key)}
            className="p-1"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  // Main Filter Content Component
  const FilterContent = () => {
    // Get translated category title
    const getCategoryTitle = (type: string) => {
      const titles: Record<string, string> = {
        indoor: `🌿 ${tCategories("indoor.title")}`,
        outdoor: `🌳 ${tCategories("outdoor.title")}`,
        pots: `🪴 ${tCategories("pots.title")}`,
        all: `🌱 ${tCategories("all.title")}`,
      }
      return titles[type] || titles.all
    }
    
    return (
    <div ref={filterContentRef} className="flex flex-col gap-2">
      {/* Category Header */}
      <div className="pb-3 mb-2 border-b border-brand-beigeDark">
        <h2 className="text-lg font-bold text-brand-oliveDark">
          {getCategoryTitle(categoryType)}
        </h2>
        {productCount > 0 && (
          <p className="text-xs text-brand-oliveDark/60 mt-1">
            {t("showResults", { count: productCount })}
          </p>
        )}
      </div>

      {/* Quick Filters */}
      <QuickFilterChips />

      {/* Active Filters Summary */}
      <ActiveFiltersSummary />

      {/* Sort (desktop only, integrated) */}
      <div className="hidden small:block pb-3 border-b border-brand-beigeDark">
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
      </div>

      {/* Filter Groups */}
      <div className="flex flex-col divide-y divide-brand-beigeDark">
        {filterGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.key)
          const selectedCount = selectedFilters[group.key]?.length || 0

          return (
            <div key={group.key} className="py-1">
              <FilterGroupHeader group={group} selectedCount={selectedCount} />
              
              {/* Filter Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? "max-h-[600px] opacity-100 pb-2" : "max-h-0 opacity-0"
                }`}
              >
                {group.type === "range" && <RangeFilter group={group} />}
                {group.type === "color" && <ColorFilter group={group} />}
                {group.type === "checkbox" && <CheckboxFilter group={group} />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Help text */}
      <div className="mt-4 p-3 bg-brand-beige/50 rounded-xl">
        <p className="text-xs text-brand-oliveDark/70 flex items-start gap-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {t("helpText")}
          </span>
        </p>
      </div>
    </div>
  )
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="small:hidden fixed bottom-4 left-4 right-4 z-40 flex gap-2">
        <button
          onClick={() => {
            setActiveTab("filters")
            setIsMobileOpen(true)
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-olive text-white py-3.5 px-4 rounded-full shadow-xl hover:bg-brand-oliveDark transition-all duration-200 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-semibold">{t("filterTitle")}</span>
          {totalSelected > 0 && (
            <span className="bg-white text-brand-olive text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              {totalSelected}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("sort")
            setIsMobileOpen(true)
          }}
          className="flex items-center justify-center gap-2 bg-white text-brand-oliveDark py-3.5 px-4 rounded-full shadow-xl border-2 border-brand-beigeDark hover:border-brand-olive transition-all duration-200 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <div className="small:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileOpen(false)} 
          />
          
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-brand-beigeDark rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-brand-beigeDark px-4 pb-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {/* Tab switcher */}
                <div className="flex bg-brand-beige rounded-full p-1">
                  <button
                    onClick={() => setActiveTab("filters")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                      activeTab === "filters" 
                        ? "bg-brand-olive text-white shadow-sm" 
                        : "text-brand-oliveDark"
                    }`}
                  >
                    {t("filterTitle")}
                  </button>
                  <button
                    onClick={() => setActiveTab("sort")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                      activeTab === "sort" 
                        ? "bg-brand-olive text-white shadow-sm" 
                        : "text-brand-oliveDark"
                    }`}
                  >
                    {tCommon("sortBy") || "Sort"}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-brand-beige rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4">
              {activeTab === "filters" ? (
                <FilterContent />
              ) : (
                <div className="py-4">
                  <h3 className="text-lg font-bold text-brand-oliveDark mb-4">{tCommon("sortBy") || "Sort by"}</h3>
                  <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-brand-beigeDark p-4 flex gap-3">
              {totalSelected > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex-shrink-0 px-4 py-3 border-2 border-brand-coral text-brand-coral rounded-full font-medium hover:bg-brand-coral/10 transition-colors"
                >
                  {t("clearAll")} ({totalSelected})
                </button>
              )}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="flex-1 bg-brand-olive text-white py-3 rounded-full font-semibold hover:bg-brand-oliveDark transition-colors shadow-lg"
              >
                {t("showResults", { count: productCount })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar */}
      <div className="hidden small:flex flex-col gap-4 py-4 mb-8 small:px-0 pl-6 small:min-w-[300px] small:max-w-[300px]">
        <FilterContent />
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default RefinementList
