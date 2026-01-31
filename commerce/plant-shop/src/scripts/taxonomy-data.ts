/**
 * Taxonomy Data - Category definitions for the plant shop
 *
 * 4 root categories only. Filtering is done via product metadata.
 */

export type CategorySeed = {
  name: string
  handle: string
  description?: string
  is_active?: boolean
}

/**
 * The 4 root categories
 */
export const CATEGORY_SEED: CategorySeed[] = [
  {
    name: "Indoor Plants",
    handle: "indoor-plants",
    description: "Plantes d'intérieur pour embellir votre maison",
    is_active: true,
  },
  {
    name: "Outdoor Plants",
    handle: "outdoor-plants",
    description: "Plantes d'extérieur pour jardins et terrasses",
    is_active: true,
  },
  {
    name: "Pots",
    handle: "pots",
    description: "Pots et jardinières pour vos plantes",
    is_active: true,
  },
  {
    name: "Accessories",
    handle: "accessories",
    description: "Accessoires pour l'entretien de vos plantes",
    is_active: true,
  },
]

/**
 * Category handles for use in scripts
 */
export const ROOT_HANDLES = {
  indoor: "indoor-plants",
  outdoor: "outdoor-plants",
  pots: "pots",
  accessories: "accessories",
} as const
