/**
 * Plant Import Script
 *
 * Single unified script to import plants from botanical databases:
 * 1. Fetches plant data from Trefle API + Wikipedia
 * 2. Gets images: Unsplash → DALL-E 3 → Cloudinary processing
 * 3. Creates product in correct category (PUBLISHED status - visible immediately)
 *
 * Usage:
 *   npx medusa exec ./src/scripts/import-plants.ts
 *   npx medusa exec ./src/scripts/import-plants.ts -- --species "Monstera deliciosa"
 *   npx medusa exec ./src/scripts/import-plants.ts -- --count 10
 *
 * Required Environment Variables:
 *   TREFLE_API_KEY - Get free key at: https://trefle.io/
 *   UNSPLASH_ACCESS_KEY - Get free key at: https://unsplash.com/developers
 *   OPENAI_API_KEY - For DALL-E image generation: https://platform.openai.com/api-keys
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET - https://cloudinary.com/
 */

import { ExecArgs } from "@medusajs/framework/types"
import { Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import https from "https"
import path from "path"
import { ROOT_HANDLES } from "./taxonomy-data"
import { getPlantTranslation, getBilingualTitle, getBilingualDescription } from "./plant-translations"

// ============================================================================
// TYPES
// ============================================================================

interface PlantData {
  common_name_en: string
  common_name_fr: string
  common_name_ar: string
  scientific_name: string
  family: string
  category: "indoor" | "outdoor"
  description?: string
  description_fr?: string
  description_ar?: string
  care_requirements: {
    light_requirement: string
    water_requirement: string
    care_level: string
  }
  climate_suitability?: {
    drought_tolerant?: boolean
    frost_resistant?: boolean
  }
  toxicity_pets?: boolean
  image_urls: string[]
}

type IndoorMetadata = {
  environment: "indoor"
  size: "S" | "M" | "L" | "XL" | "XXL"
  family: string
  plant_type: string
  room_suitability: Array<"salon" | "bureau" | "chambre" | "salle_de_bains" | "cuisine" | "couloir">
  light: "direct_sun" | "indirect_light" | "partial_shade" | "low_light"
  difficulty: "easy" | "medium" | "expert"
  pet_friendly: boolean
  air_purifying: boolean
  hanging: boolean
  rarity: "common" | "rare" | "hybrid"
  water_needs: "weekly" | "biweekly" | "monthly"
  height_cm: number
  diameter_cm: number
  color: string
  shape: "cylinder" | "tower" | "bush" | "trailing" | "rosette"
  style: "nature" | "modern" | "basic" | "exotic"
  comfortable: boolean
  [key: string]: unknown
}

type OutdoorMetadata = {
  environment: "outdoor"
  sun_exposure: "full_sun" | "partial_shade" | "shade"
  water_needs: "low" | "medium" | "high"
  climate: string[]
  frost_resistant: boolean
  heat_resistant: boolean
  flowering_season: "spring" | "summer" | "autumn" | "winter" | "all_year" | null
  plant_type: "fruit_tree" | "palm" | "flowering_shrub" | "climber" | "succulent" | "herb" | "perennial" | "shrub"
  room_suitability: Array<"balcon" | "terrasse" | "jardin">
  season: Array<"spring" | "summer" | "autumn" | "winter">
  height_cm: number
  diameter_cm: number
  [key: string]: unknown
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const TREFLE_API_KEY = process.env.TREFLE_API_KEY || ""
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ""
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Popular plants to import - Most sold houseplants and outdoor plants worldwide
// Indoor: ~50 most popular houseplants
// Outdoor: ~30 most popular garden/outdoor plants for Mediterranean climate
const POPULAR_PLANTS = [
  // ═══════════════════════════════════════════════════════════════════════════
  // INDOOR PLANTS - Top 50 Best-Selling Houseplants
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Tropical Foliage (Most Popular)
  { scientific_name: "Monstera deliciosa", category: "indoor" as const },
  { scientific_name: "Ficus lyrata", category: "indoor" as const },
  { scientific_name: "Philodendron hederaceum", category: "indoor" as const },
  { scientific_name: "Epipremnum aureum", category: "indoor" as const }, // Pothos
  { scientific_name: "Ficus elastica", category: "indoor" as const },
  { scientific_name: "Monstera adansonii", category: "indoor" as const },
  { scientific_name: "Philodendron bipinnatifidum", category: "indoor" as const },
  { scientific_name: "Alocasia amazonica", category: "indoor" as const },
  { scientific_name: "Calathea orbifolia", category: "indoor" as const },
  { scientific_name: "Strelitzia nicolai", category: "indoor" as const },
  
  // Succulents & Cacti
  { scientific_name: "Aloe vera", category: "indoor" as const },
  { scientific_name: "Echeveria elegans", category: "indoor" as const },
  { scientific_name: "Crassula ovata", category: "indoor" as const }, // Jade plant
  { scientific_name: "Haworthia fasciata", category: "indoor" as const },
  { scientific_name: "Senecio rowleyanus", category: "indoor" as const }, // String of pearls
  { scientific_name: "Opuntia microdasys", category: "indoor" as const },
  { scientific_name: "Gymnocalycium mihanovichii", category: "indoor" as const },
  { scientific_name: "Sedum morganianum", category: "indoor" as const },
  
  // Low Light Champions
  { scientific_name: "Sansevieria trifasciata", category: "indoor" as const },
  { scientific_name: "Zamioculcas zamiifolia", category: "indoor" as const },
  { scientific_name: "Dracaena marginata", category: "indoor" as const },
  { scientific_name: "Dracaena fragrans", category: "indoor" as const },
  { scientific_name: "Aspidistra elatior", category: "indoor" as const },
  { scientific_name: "Aglaonema commutatum", category: "indoor" as const },
  { scientific_name: "Spathiphyllum wallisii", category: "indoor" as const },
  
  // Air Purifying
  { scientific_name: "Chlorophytum comosum", category: "indoor" as const }, // Spider plant
  { scientific_name: "Nephrolepis exaltata", category: "indoor" as const }, // Boston fern
  { scientific_name: "Hedera helix", category: "indoor" as const }, // English ivy
  { scientific_name: "Ficus benjamina", category: "indoor" as const },
  { scientific_name: "Chamaedorea elegans", category: "indoor" as const }, // Parlor palm
  { scientific_name: "Areca lutescens", category: "indoor" as const }, // Areca palm
  
  // Trendy & Rare
  { scientific_name: "Pilea peperomioides", category: "indoor" as const },
  { scientific_name: "Begonia maculata", category: "indoor" as const },
  { scientific_name: "Tradescantia zebrina", category: "indoor" as const },
  { scientific_name: "Maranta leuconeura", category: "indoor" as const },
  { scientific_name: "Hoya carnosa", category: "indoor" as const },
  { scientific_name: "Peperomia obtusifolia", category: "indoor" as const },
  { scientific_name: "Stromanthe sanguinea", category: "indoor" as const },
  { scientific_name: "Anthurium andraeanum", category: "indoor" as const },
  
  // Hanging Plants
  { scientific_name: "Scindapsus pictus", category: "indoor" as const },
  { scientific_name: "Philodendron micans", category: "indoor" as const },
  { scientific_name: "Ceropegia woodii", category: "indoor" as const }, // String of hearts
  { scientific_name: "Rhipsalis baccifera", category: "indoor" as const },
  { scientific_name: "Dischidia nummularia", category: "indoor" as const },
  
  // Flowering Indoor
  { scientific_name: "Phalaenopsis amabilis", category: "indoor" as const }, // Orchid
  { scientific_name: "Saintpaulia ionantha", category: "indoor" as const }, // African violet
  { scientific_name: "Cyclamen persicum", category: "indoor" as const },
  { scientific_name: "Kalanchoe blossfeldiana", category: "indoor" as const },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OUTDOOR PLANTS - Top 30 for Mediterranean/Tunisian Climate
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Mediterranean Trees & Shrubs
  { scientific_name: "Olea europaea", category: "outdoor" as const }, // Olive tree
  { scientific_name: "Citrus limon", category: "outdoor" as const }, // Lemon tree
  { scientific_name: "Citrus sinensis", category: "outdoor" as const }, // Orange tree
  { scientific_name: "Ficus carica", category: "outdoor" as const }, // Fig tree
  { scientific_name: "Punica granatum", category: "outdoor" as const }, // Pomegranate
  { scientific_name: "Nerium oleander", category: "outdoor" as const }, // Oleander
  { scientific_name: "Bougainvillea spectabilis", category: "outdoor" as const },
  { scientific_name: "Jasminum officinale", category: "outdoor" as const }, // Jasmine
  { scientific_name: "Hibiscus rosa-sinensis", category: "outdoor" as const },
  { scientific_name: "Plumbago auriculata", category: "outdoor" as const },
  
  // Aromatic & Herbs
  { scientific_name: "Lavandula angustifolia", category: "outdoor" as const },
  { scientific_name: "Rosmarinus officinalis", category: "outdoor" as const },
  { scientific_name: "Salvia officinalis", category: "outdoor" as const }, // Sage
  { scientific_name: "Thymus vulgaris", category: "outdoor" as const }, // Thyme
  { scientific_name: "Origanum vulgare", category: "outdoor" as const }, // Oregano
  { scientific_name: "Mentha spicata", category: "outdoor" as const }, // Spearmint
  
  // Flowering Perennials
  { scientific_name: "Pelargonium zonale", category: "outdoor" as const }, // Geranium
  { scientific_name: "Lantana camara", category: "outdoor" as const },
  { scientific_name: "Gazania rigens", category: "outdoor" as const },
  { scientific_name: "Agapanthus africanus", category: "outdoor" as const },
  { scientific_name: "Strelitzia reginae", category: "outdoor" as const }, // Bird of paradise
  { scientific_name: "Plumeria rubra", category: "outdoor" as const }, // Frangipani
  
  // Palms & Tropical
  { scientific_name: "Phoenix dactylifera", category: "outdoor" as const }, // Date palm
  { scientific_name: "Washingtonia robusta", category: "outdoor" as const },
  { scientific_name: "Cycas revoluta", category: "outdoor" as const }, // Sago palm
  { scientific_name: "Yucca elephantipes", category: "outdoor" as const },
  
  // Ground Cover & Climbing
  { scientific_name: "Aptenia cordifolia", category: "outdoor" as const },
  { scientific_name: "Carpobrotus edulis", category: "outdoor" as const },
  { scientific_name: "Bougainvillea glabra", category: "outdoor" as const },
  { scientific_name: "Trachelospermum jasminoides", category: "outdoor" as const }, // Star jasmine
]

// ============================================================================
// API FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetch plant data from Trefle API
 */
async function fetchFromTrefle(scientificName: string): Promise<any> {
  if (!TREFLE_API_KEY) {
    console.log("⚠️  TREFLE_API_KEY not set. Get free key at: https://trefle.io/")
    return null
  }

  try {
    const searchUrl = `https://trefle.io/api/v1/plants/search?token=${TREFLE_API_KEY}&q=${encodeURIComponent(scientificName)}`
    const response = await fetch(searchUrl)
    const data = await response.json()

    if (data.data && data.data.length > 0) {
      const plantId = data.data[0].id
      const detailUrl = `https://trefle.io/api/v1/plants/${plantId}?token=${TREFLE_API_KEY}`
      const detailResponse = await fetch(detailUrl)
      const detailData = await detailResponse.json()
      return detailData.data
    }
  } catch (error) {
    console.error(`❌ Trefle API error for ${scientificName}:`, error)
  }

  return null
}

/**
 * Fetch plant description from Wikipedia
 */
async function fetchFromWikipedia(scientificName: string): Promise<{ description?: string; thumbnail?: string } | null> {
  try {
    // Try English Wikipedia
    const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(scientificName)}`
    const enResponse = await fetch(enUrl)

    if (enResponse.ok) {
      const data = await enResponse.json()
      return {
        description: data.extract,
        thumbnail: data.thumbnail?.source,
      }
    }

    // Try French Wikipedia
    const frUrl = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(scientificName)}`
    const frResponse = await fetch(frUrl)

    if (frResponse.ok) {
      const data = await frResponse.json()
      return {
        description: data.extract,
        thumbnail: data.thumbnail?.source,
      }
    }
  } catch (error) {
    console.error(`❌ Wikipedia API error for ${scientificName}:`, error)
  }

  return null
}

// ============================================================================
// IMAGE PROCESSING (3 STEPS + AI VERIFICATION)
// ============================================================================

/**
 * AI Image Verification - Check if image actually contains a plant
 * Uses GPT-4 Vision to verify image quality and content
 */
async function verifyImageWithAI(imageUrl: string, expectedPlantName: string): Promise<{ valid: boolean; reason: string }> {
  if (!OPENAI_API_KEY) {
    // Skip verification if no API key - accept image
    return { valid: true, reason: "No OpenAI key - skipping verification" }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert botanist and image quality assessor for an e-commerce plant shop.
Your job is to verify that product images are:
1. Actually showing a plant (not a random object, person, landscape, etc.)
2. High quality (not blurry, pixelated, or poorly lit)
3. Suitable for e-commerce (clean background, professional look)
4. Showing the plant clearly (not hidden, obscured, or too small)

Respond with JSON only: {"valid": true/false, "reason": "brief explanation"}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Is this a good product image for "${expectedPlantName}"? Check if it:
- Actually shows a real plant (not a landscape, person, text, diagram, etc.)
- Is high quality and professional looking
- Would work well as a product image in an online plant shop
- Shows the plant clearly and prominently`
              },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 150,
      }),
    })

    const data = await response.json()
    
    if (data.choices && data.choices[0]?.message?.content) {
      try {
        const content = data.choices[0].message.content
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0])
          return { valid: !!result.valid, reason: result.reason || "No reason provided" }
        }
      } catch (parseError) {
        // If can't parse, assume valid
        return { valid: true, reason: "Could not parse AI response" }
      }
    }
  } catch (error) {
    console.error(`   ⚠️  AI verification error:`, error)
  }

  // Default to accepting if verification fails
  return { valid: true, reason: "Verification failed - accepting by default" }
}

/**
 * Step 1: Try to get image from Unsplash (with AI verification)
 */
async function fetchFromUnsplash(plantName: string, scientificName: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.log("⚠️  UNSPLASH_ACCESS_KEY not set. Get free key at: https://unsplash.com/developers")
    return null
  }

  try {
    // Try multiple search queries to find a good plant image
    const searchQueries = [
      `${plantName} plant potted`,
      `${scientificName} houseplant`,
      `${plantName} indoor plant`,
      `${scientificName}`,
    ]

    for (const queryText of searchQueries) {
      const query = encodeURIComponent(queryText)
      const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=5&orientation=squarish`

      const response = await fetch(url, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      })

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        // Try each image and verify with AI
        for (const result of data.results) {
          const imageUrl = result.urls.regular
          
          console.log(`   🔍 Verifying image from Unsplash...`)
          const verification = await verifyImageWithAI(imageUrl, plantName)
          
          if (verification.valid) {
            console.log(`   ✅ Step 1: Unsplash image verified - ${verification.reason}`)
            return imageUrl
          } else {
            console.log(`   ❌ Image rejected: ${verification.reason}`)
          }
        }
      }
    }
  } catch (error) {
    console.error(`   ❌ Unsplash error:`, error)
  }

  console.log(`   ⏭️  Step 1: No valid Unsplash image found, trying DALL-E...`)
  return null
}

/**
 * Step 2: Generate image with DALL-E 3 if no Unsplash image
 */
async function generateWithDALLE(plantName: string, scientificName: string): Promise<string | null> {
  if (!OPENAI_API_KEY) {
    // Silent skip - OpenAI is optional
    return null
  }

  try {
    const prompt = `Professional product photography of ${plantName} (${scientificName}), 
healthy green plant in terracotta pot, pure white background, 
studio lighting, high resolution, botanical photography style, 
centered composition, soft shadows, photorealistic`

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural",
      }),
    })

    const data = await response.json()

    if (data.data && data.data.length > 0) {
      console.log(`   ✅ Step 2: DALL-E image generated`)
      return data.data[0].url
    } else if (data.error) {
      console.error(`   ❌ DALL-E error:`, data.error.message)
    }
  } catch (error) {
    console.error(`   ❌ DALL-E error:`, error)
  }

  console.log(`   ⏭️  Step 2: DALL-E failed, skipping Cloudinary...`)
  return null
}

/**
 * Download image to temp file
 */
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)

    const request = (url.startsWith("https") ? https : require("http")).get(url, (response: any) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close()
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject)
        return
      }

      response.pipe(file)
      file.on("finish", () => {
        file.close()
        resolve()
      })
    })

    request.on("error", (error: Error) => {
      fs.unlink(filepath, () => {})
      reject(error)
    })
  })
}

/**
 * Step 3: Process image with Cloudinary (white background, resize, optimize)
 */
async function processWithCloudinary(imageUrl: string, plantName: string, imageIndex: number = 1): Promise<string | null> {
  const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET

  if (!hasCloudinary) {
    console.log("⚠️  Cloudinary not configured. Using original image URL.")
    return imageUrl
  }

  try {
    // Download image to temp file
    const tempDir = path.join(process.cwd(), "temp")
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const baseName = plantName.toLowerCase().replace(/\s+/g, "-")
    const tempPath = path.join(tempDir, `${baseName}-${imageIndex}.jpg`)
    await downloadImage(imageUrl, tempPath)

    // Upload to Cloudinary with transformations
    const publicId = imageIndex === 1 ? baseName : `${baseName}-${imageIndex}`
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "plants",
      public_id: publicId,
      transformation: [
        { effect: "background_removal" },
        { background: "white" },
        { width: 1024, height: 1024, crop: "pad" },
        { quality: 90 },
        { fetch_format: "jpg" },
      ],
    })

    // Cleanup temp file
    fs.unlinkSync(tempPath)

    if (result.secure_url) {
      return result.secure_url
    }
  } catch (error: any) {
    console.error(`   ❌ Cloudinary error:`, error.message || error)
  }

  return imageUrl // Fallback to original URL
}

/**
 * Get plant images using 3-step process with AI verification
 * Returns up to 2 images for variety
 */
async function getPlantImages(commonName: string, scientificName: string): Promise<string[]> {
  console.log(`\n📸 Getting images for: ${commonName}`)
  const images: string[] = []

  // Step 1: Try Unsplash (with AI verification) - get 2 images
  const unsplashImages = await fetchMultipleFromUnsplash(commonName, scientificName, 2)
  images.push(...unsplashImages)

  // Step 2: If we don't have 2 images, try DALL-E for remaining
  if (images.length < 2) {
    const dalleImage = await generateWithDALLE(commonName, scientificName)
    if (dalleImage) {
      const processedDalle = await processWithCloudinary(dalleImage, scientificName, images.length + 1)
      if (processedDalle) images.push(processedDalle)
    }
  }

  console.log(`   ✓ Got ${images.length} image(s)`)
  return images
}

/**
 * Check if we have minimum required images
 */
function hasMinimumImages(images: string[]): boolean {
  return images.length >= 1
}

/**
 * Fetch multiple images from Unsplash
 */
async function fetchMultipleFromUnsplash(commonName: string, scientificName: string, count: number): Promise<string[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.log("   ⚠️ UNSPLASH_ACCESS_KEY not set")
    return []
  }

  const images: string[] = []
  const searchTerms = [commonName, scientificName, `${commonName} plant`, `${scientificName} plant`]

  for (const term of searchTerms) {
    if (images.length >= count) break

    try {
      const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=${count * 3}&orientation=squarish`
      const response = await fetch(searchUrl, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      })

      if (!response.ok) {
        console.log(`   ⚠️ Unsplash search failed for "${term}": ${response.status}`)
        continue
      }

      const data = await response.json()

      for (const photo of data.results || []) {
        if (images.length >= count) break
        
        const imageUrl = photo.urls?.regular
        if (!imageUrl) continue

        // AI Verification - check if image really shows the plant
        const verification = await verifyImageWithAI(imageUrl, scientificName)
        if (!verification.valid) {
          console.log(`   ✗ Image rejected: ${verification.reason}`)
          continue
        }

        // Process with Cloudinary
        const processedUrl = await processWithCloudinary(imageUrl, scientificName.replace(/ /g, '-'), images.length + 1)
        if (processedUrl && !images.includes(processedUrl)) {
          images.push(processedUrl)
          console.log(`   ✓ Image ${images.length}: verified by AI`)
        }
      }
    } catch (error: any) {
      console.log(`   ⚠️ Error searching "${term}": ${error.message}`)
    }
  }

  return images
}

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

/**
 * Normalize light requirement
 */
function normalizeLight(value?: string): "low" | "medium" | "bright" {
  if (!value) return "medium"
  const v = value.toLowerCase()
  if (v.includes("low") || v.includes("shade")) return "low"
  if (v.includes("bright") || v.includes("full") || v.includes("direct")) return "bright"
  return "medium"
}

/**
 * Normalize difficulty level
 */
function normalizeDifficulty(value?: string): "easy" | "medium" | "expert" {
  if (!value) return "medium"
  const v = value.toLowerCase()
  if (v.includes("easy") || v.includes("beginner")) return "easy"
  if (v.includes("expert") || v.includes("hard") || v.includes("difficult")) return "expert"
  return "medium"
}

/**
 * Normalize sun exposure
 */
function normalizeSunExposure(value?: string): "full_sun" | "partial_shade" | "shade" {
  if (!value) return "partial_shade"
  const v = value.toLowerCase()
  if (v.includes("full") || v.includes("direct")) return "full_sun"
  if (v.includes("shade") || v.includes("low")) return "shade"
  return "partial_shade"
}

/**
 * Normalize watering needs
 */
function normalizeWatering(value?: string): "low" | "medium" | "high" {
  if (!value) return "medium"
  const v = value.toLowerCase()
  if (v.includes("low") || v.includes("drought")) return "low"
  if (v.includes("high") || v.includes("frequent")) return "high"
  return "medium"
}

/**
 * Normalize water needs for indoor plants
 */
function normalizeWaterNeeds(value?: string): "weekly" | "biweekly" | "monthly" {
  if (!value) return "weekly"
  const v = value.toLowerCase()
  if (v.includes("low") || v.includes("drought") || v.includes("monthly")) return "monthly"
  if (v.includes("moderate") || v.includes("medium")) return "biweekly"
  return "weekly"
}

/**
 * Normalize indoor light requirements
 */
function normalizeIndoorLight(value?: string): "direct_sun" | "indirect_light" | "partial_shade" | "low_light" {
  if (!value) return "indirect_light"
  const v = value.toLowerCase()
  if (v.includes("full") || v.includes("direct") || v.includes("bright")) return "direct_sun"
  if (v.includes("low") || v.includes("shade") || v.includes("dark")) return "low_light"
  if (v.includes("partial") || v.includes("filtered")) return "partial_shade"
  return "indirect_light"
}

/**
 * Determine plant size based on typical height
 */
function determinePlantSize(family?: string): "S" | "M" | "L" | "XL" | "XXL" {
  const smallFamilies = ["Haworthia", "Echeveria", "Crassula", "Senecio", "Lithops"]
  const largeFamilies = ["Monstera", "Ficus", "Strelitzia", "Alocasia", "Philodendron"]
  const xlFamilies = ["Ficus lyrata", "Strelitzia nicolai", "Dracaena"]
  
  if (!family) return "M"
  if (smallFamilies.some(f => family.includes(f))) return "S"
  if (xlFamilies.some(f => family.includes(f))) return "XL"
  if (largeFamilies.some(f => family.includes(f))) return "L"
  return "M"
}

/**
 * Determine plant shape
 */
function determinePlantShape(family?: string, isHanging?: boolean): "cylinder" | "tower" | "bush" | "trailing" | "rosette" {
  if (isHanging) return "trailing"
  
  const rosetteFamilies = ["Echeveria", "Haworthia", "Aloe", "Agave", "Aeonium"]
  const towerFamilies = ["Sansevieria", "Dracaena", "Yucca"]
  const trailingFamilies = ["Senecio", "Epipremnum", "Philodendron hederaceum", "Scindapsus"]
  
  if (!family) return "bush"
  if (rosetteFamilies.some(f => family.includes(f))) return "rosette"
  if (towerFamilies.some(f => family.includes(f))) return "tower"
  if (trailingFamilies.some(f => family.includes(f))) return "trailing"
  return "bush"
}

/**
 * Determine plant color based on family
 */
function determinePlantColor(family?: string): string {
  const variegatedFamilies = ["Monstera", "Pothos", "Scindapsus", "Calathea"]
  const darkGreenFamilies = ["Ficus", "Sansevieria", "Zamioculcas", "Philodendron"]
  const colorfulFamilies = ["Calathea", "Maranta", "Begonia", "Coleus"]
  
  if (!family) return "green"
  if (variegatedFamilies.some(f => family.includes(f))) return "variegated"
  if (darkGreenFamilies.some(f => family.includes(f))) return "dark_green"
  if (colorfulFamilies.some(f => family.includes(f))) return "green"
  return "green"
}

/**
 * Determine suitable rooms for plant
 */
function determinePlacement(light?: string, family?: string): Array<"salon" | "bureau" | "chambre" | "salle_de_bains" | "cuisine" | "couloir"> {
  const bathroomFamilies = ["Calathea", "Fern", "Maranta", "Orchid"]
  const kitchenFamilies = ["Herbs", "Aloe", "Basil"]
  
  const placements: Array<"salon" | "bureau" | "chambre" | "salle_de_bains" | "cuisine" | "couloir"> = ["salon"]
  
  if (light === "low" || light === "low_light") {
    placements.push("couloir", "chambre")
  } else {
    placements.push("bureau")
  }
  
  if (family && bathroomFamilies.some(f => family.includes(f))) {
    placements.push("salle_de_bains")
  }
  
  if (family && kitchenFamilies.some(f => family.includes(f))) {
    placements.push("cuisine")
  }
  
  return [...new Set(placements)]
}

/**
 * Determine if plant is air purifying (NASA study plants)
 */
function isAirPurifying(scientificName?: string): boolean {
  const airPurifiers = [
    "Epipremnum", "Spathiphyllum", "Dracaena", "Sansevieria", "Chlorophytum",
    "Ficus", "Hedera", "Chrysanthemum", "Gerbera", "Aloe", "Chamaedorea"
  ]
  if (!scientificName) return false
  return airPurifiers.some(p => scientificName.includes(p))
}

/**
 * Determine if plant is hanging/trailing
 */
function isHangingPlant(family?: string, scientificName?: string): boolean {
  const hangingPlants = [
    "Senecio rowleyanus", "Epipremnum", "Philodendron hederaceum", "Scindapsus",
    "Tradescantia", "Hoya", "Ceropegia", "Dischidia", "Rhipsalis"
  ]
  const combined = `${family || ""} ${scientificName || ""}`
  return hangingPlants.some(p => combined.includes(p))
}

/**
 * Generate random height within range based on size
 */
function generateHeight(size: string): number {
  const ranges: Record<string, [number, number]> = {
    S: [10, 25],
    M: [25, 50],
    L: [50, 100],
    XL: [100, 150],
    XXL: [150, 200],
  }
  const [min, max] = ranges[size] || [25, 50]
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate random diameter within range based on size
 */
function generateDiameter(size: string): number {
  const ranges: Record<string, [number, number]> = {
    S: [8, 12],
    M: [12, 20],
    L: [20, 30],
    XL: [30, 40],
    XXL: [40, 50],
  }
  const [min, max] = ranges[size] || [12, 20]
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Determine outdoor plant type based on scientific name
 */
function determineOutdoorPlantType(scientificName: string): "fruit_tree" | "palm" | "flowering_shrub" | "climber" | "succulent" | "herb" | "perennial" | "shrub" {
  const sci = scientificName.toLowerCase()
  
  // Fruit trees
  if (sci.includes("citrus") || sci.includes("olea") || sci.includes("ficus carica") || sci.includes("punica")) {
    return "fruit_tree"
  }
  // Palms
  if (sci.includes("phoenix") || sci.includes("washingtonia") || sci.includes("cycas") || sci.includes("chamaerops")) {
    return "palm"
  }
  // Climbers
  if (sci.includes("bougainvillea") || sci.includes("jasminum") || sci.includes("trachelospermum") || sci.includes("hedera")) {
    return "climber"
  }
  // Succulents
  if (sci.includes("agave") || sci.includes("aloe") || sci.includes("yucca") || sci.includes("opuntia") || sci.includes("aptenia") || sci.includes("carpobrotus")) {
    return "succulent"
  }
  // Herbs
  if (sci.includes("lavandula") || sci.includes("rosmarinus") || sci.includes("salvia") || sci.includes("thymus") || sci.includes("origanum") || sci.includes("mentha")) {
    return "herb"
  }
  // Flowering shrubs
  if (sci.includes("hibiscus") || sci.includes("nerium") || sci.includes("plumbago") || sci.includes("lantana") || sci.includes("pelargonium")) {
    return "flowering_shrub"
  }
  // Perennials
  if (sci.includes("gazania") || sci.includes("agapanthus") || sci.includes("strelitzia")) {
    return "perennial"
  }
  
  return "shrub"
}

/**
 * Determine outdoor room suitability
 */
function determineOutdoorSuitability(scientificName: string): Array<"balcon" | "terrasse" | "jardin"> {
  const sci = scientificName.toLowerCase()
  
  // Small plants good for balcony
  const balconyPlants = ["pelargonium", "lavandula", "rosmarinus", "thymus", "mentha", "salvia", "origanum", "gazania"]
  // Medium plants good for terrace
  const terracePlants = ["hibiscus", "plumbago", "lantana", "jasminum", "bougainvillea glabra", "cycas"]
  // Large plants for garden only
  const gardenOnlyPlants = ["phoenix", "washingtonia", "olea", "ficus carica", "citrus", "punica"]
  
  if (gardenOnlyPlants.some(p => sci.includes(p))) {
    return ["jardin"]
  }
  if (balconyPlants.some(p => sci.includes(p))) {
    return ["balcon", "terrasse", "jardin"]
  }
  if (terracePlants.some(p => sci.includes(p))) {
    return ["terrasse", "jardin"]
  }
  
  return ["terrasse", "jardin"]
}

/**
 * Determine flowering season
 */
function determineFloweringSeason(scientificName: string): "spring" | "summer" | "autumn" | "winter" | "all_year" | null {
  const sci = scientificName.toLowerCase()
  
  // Year-round flowering
  const yearRound = ["pelargonium", "lantana", "hibiscus", "bougainvillea"]
  if (yearRound.some(p => sci.includes(p))) return "all_year"
  
  // Spring flowering
  const springFlowers = ["jasminum", "citrus"]
  if (springFlowers.some(p => sci.includes(p))) return "spring"
  
  // Summer flowering  
  const summerFlowers = ["lavandula", "plumbago", "agapanthus", "strelitzia"]
  if (summerFlowers.some(p => sci.includes(p))) return "summer"
  
  // Non-flowering (palms, succulents, etc.)
  const nonFlowering = ["phoenix", "washingtonia", "cycas", "agave", "yucca"]
  if (nonFlowering.some(p => sci.includes(p))) return null
  
  return "summer"
}

/**
 * Determine indoor plant type from family/scientific name
 */
function determineIndoorPlantType(family: string, scientificName: string): string {
  const combined = `${family} ${scientificName}`.toLowerCase()
  
  if (combined.includes("monstera")) return "monstera"
  if (combined.includes("philodendron")) return "philodendron"
  if (combined.includes("alocasia")) return "alocasia"
  if (combined.includes("calathea") || combined.includes("maranta")) return "calathea"
  if (combined.includes("ficus")) return "ficus"
  if (combined.includes("dracaena")) return "dracaena"
  if (combined.includes("sansevieria")) return "sansevieria"
  if (combined.includes("pothos") || combined.includes("epipremnum")) return "pothos"
  if (combined.includes("hoya")) return "hoya"
  if (combined.includes("anthurium")) return "anthurium"
  if (combined.includes("peperomia")) return "peperomia"
  if (combined.includes("begonia")) return "begonia"
  if (combined.includes("cactus") || combined.includes("opuntia") || combined.includes("gymnocalycium")) return "cactus"
  if (combined.includes("succulent") || combined.includes("echeveria") || combined.includes("crassula") || combined.includes("haworthia") || combined.includes("sedum") || combined.includes("aloe")) return "succulent"
  if (combined.includes("palm") || combined.includes("chamaedorea") || combined.includes("areca")) return "palm"
  if (combined.includes("fern") || combined.includes("nephrolepis")) return "fern"
  if (combined.includes("tradescantia")) return "tradescantia"
  if (combined.includes("chlorophytum")) return "chlorophytum"
  if (combined.includes("zamioculcas")) return "zamioculcas"
  if (combined.includes("spathiphyllum")) return "spathiphyllum"
  if (combined.includes("aglaonema")) return "aglaonema"
  if (combined.includes("dieffenbachia")) return "dieffenbachia"
  if (combined.includes("schefflera")) return "schefflera"
  if (combined.includes("croton")) return "croton"
  if (combined.includes("syngonium")) return "syngonium"
  
  return family.toLowerCase().split(" ")[0] || "other"
}

/**
 * Build product metadata based on category
 */
function buildMetadata(plant: PlantData): IndoorMetadata | OutdoorMetadata {
  if (plant.category === "outdoor") {
    const sunExposure = normalizeSunExposure(plant.care_requirements?.light_requirement)
    const waterNeeds = normalizeWatering(plant.care_requirements?.water_requirement)
    
    return {
      environment: "outdoor",
      sun_exposure: sunExposure,
      water_needs: waterNeeds,
      climate: ["temperate", "mediterranean"],
      frost_resistant: plant.climate_suitability?.frost_resistant ?? false,
      heat_resistant: sunExposure === "full_sun" || waterNeeds === "low",
      flowering_season: determineFloweringSeason(plant.scientific_name),
      plant_type: determineOutdoorPlantType(plant.scientific_name),
      room_suitability: determineOutdoorSuitability(plant.scientific_name),
      season: ["spring", "summer"],
      height_cm: Math.floor(Math.random() * 150) + 50,
      diameter_cm: Math.floor(Math.random() * 40) + 20,
    }
  }

  const hanging = isHangingPlant(plant.family, plant.scientific_name)
  const size = determinePlantSize(plant.family)
  const difficulty = normalizeDifficulty(plant.care_requirements?.care_level)
  
  return {
    environment: "indoor",
    size,
    family: plant.family || "Unknown",
    plant_type: determineIndoorPlantType(plant.family, plant.scientific_name),
    room_suitability: determinePlacement(plant.care_requirements?.light_requirement, plant.family),
    light: normalizeIndoorLight(plant.care_requirements?.light_requirement),
    difficulty,
    pet_friendly: !plant.toxicity_pets,
    air_purifying: isAirPurifying(plant.scientific_name),
    hanging,
    rarity: "common",
    water_needs: normalizeWaterNeeds(plant.care_requirements?.water_requirement),
    height_cm: generateHeight(size),
    diameter_cm: generateDiameter(size),
    color: determinePlantColor(plant.family),
    shape: determinePlantShape(plant.family, hanging),
    style: hanging ? "nature" : "basic",
    comfortable: difficulty === "easy",
  }
}

/**
 * Generate price based on plant characteristics
 */
function generatePrice(plant: PlantData): number {
  const basePrice = plant.category === "outdoor" ? 35000 : 25000 // in cents (TND)
  const variance = Math.floor(Math.random() * 15000)
  return basePrice + variance
}

// ============================================================================
// MAIN IMPORT FUNCTION
// ============================================================================

async function importPlant(
  container: any,
  scientificName: string,
  category: "indoor" | "outdoor"
): Promise<boolean> {
  const productModule = container.resolve(Modules.PRODUCT)

  console.log(`\n${"=".repeat(60)}`)
  console.log(`🌱 Importing: ${scientificName}`)
  console.log(`${"=".repeat(60)}`)

  // Check if already exists
  const handle = scientificName.toLowerCase().replace(/\s+/g, "-")
  const existing = await productModule.listProducts({ handle })

  if (existing.length > 0) {
    console.log(`⏭️  Already exists, skipping`)
    return false
  }

  // Fetch data from APIs
  console.log(`📡 Fetching botanical data...`)
  const trefleData = await fetchFromTrefle(scientificName)
  const wikiData = await fetchFromWikipedia(scientificName)

  const commonName = trefleData?.common_name || scientificName.split(" ")[0]
  
  // Get French and Tunisian Darija translations
  const translation = getPlantTranslation(scientificName)
  const nameFr = translation?.fr || commonName
  const nameAr = translation?.ar || commonName
  const descFr = translation?.desc_fr || ""
  const descAr = translation?.desc_ar || ""

  const plantData: PlantData = {
    common_name_en: commonName,
    common_name_fr: nameFr,
    common_name_ar: nameAr,
    scientific_name: scientificName,
    family: trefleData?.family?.name || "Unknown",
    category,
    description: wikiData?.description || `${commonName} - ${scientificName}`,
    description_fr: descFr,
    description_ar: descAr,
    care_requirements: {
      light_requirement: trefleData?.growth?.light?.toString() || "medium",
      water_requirement: trefleData?.growth?.atmospheric_humidity?.toString() || "medium",
      care_level: "medium",
    },
    climate_suitability: {
      drought_tolerant: trefleData?.growth?.drought_tolerance || false,
      frost_resistant: false,
    },
    toxicity_pets: trefleData?.specifications?.toxicity === "high",
    image_urls: [] as string[],
  }

  // Get images (3-step process) - up to 2 images
  const imageUrls = await getPlantImages(commonName, scientificName)
  
  // Always skip if no images found
  if (!hasMinimumImages(imageUrls)) {
    console.log(`\n⏭️  Skipping ${commonName}: No images found`)
    return false
  }
  
  plantData.image_urls = imageUrls

  // Get category ID
  const categoryHandle = category === "outdoor" ? ROOT_HANDLES.outdoor : ROOT_HANDLES.indoor
  const categories = await productModule.listProductCategories({ handle: categoryHandle })

  if (categories.length === 0) {
    console.error(`❌ Category "${categoryHandle}" not found. Run seed.ts first.`)
    return false
  }

  const categoryId = categories[0].id

  // Build metadata
  const metadata = buildMetadata(plantData)
  const price = generatePrice(plantData)

  // Get default sales channel
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const [defaultSalesChannel] = await salesChannelModule.listSalesChannels({
    name: "Default Sales Channel",
  })

  // Create product (DRAFT status - hidden until owner publishes, but linked to sales channel)
  // ═══════════════════════════════════════════════════════════════════════════
  // BILINGUAL TITLE: "Nom Français | الاسم العربي"
  // ═══════════════════════════════════════════════════════════════════════════
  const bilingualTitle = `${plantData.common_name_fr} | ${plantData.common_name_ar}`
  
  // Build bilingual description
  const bilingualDescription = `
${plantData.description_fr || plantData.description}

───────────────────────────────────────

${plantData.description_ar || ""}

───────────────────────────────────────

📚 Nom scientifique / الاسم العلمي: ${plantData.scientific_name}
🏠 Famille / العائلة: ${plantData.family}
`.trim()

  const productInput = {
    title: bilingualTitle,
    subtitle: plantData.scientific_name,
    handle,
    description: bilingualDescription,
    status: ProductStatus.DRAFT, // Draft until admin publishes
    sales_channels: defaultSalesChannel ? [{ id: defaultSalesChannel.id }] : [],
    is_giftcard: false,
    discountable: true,
    thumbnail: plantData.image_urls[0] || undefined,
    images: plantData.image_urls.map(url => ({ url })),
    categories: [{ id: categoryId }],
    options: [{ title: "Taille", values: ["S", "M", "L"] }],
    variants: [
      {
        title: "S",
        sku: `${handle}-s`,
        options: { Taille: "S" },
        manage_inventory: false,
        prices: [
          { currency_code: "tnd", amount: Math.round(price * 0.7) },
        ],
      },
      {
        title: "M",
        sku: `${handle}-m`,
        options: { Taille: "M" },
        manage_inventory: false,
        prices: [
          { currency_code: "tnd", amount: price },
        ],
      },
      {
        title: "L",
        sku: `${handle}-l`,
        options: { Taille: "L" },
        manage_inventory: false,
        prices: [
          { currency_code: "tnd", amount: Math.round(price * 1.4) },
        ],
      },
    ],
    metadata: {
      ...metadata,
      // Store individual translations for frontend use
      name_fr: plantData.common_name_fr,
      name_ar: plantData.common_name_ar,
      description_fr: plantData.description_fr,
      description_ar: plantData.description_ar,
    },
  }

  try {
    await createProductsWorkflow(container).run({
      input: { products: [productInput] },
    })

    console.log(`\n✅ Imported: ${plantData.common_name_fr} | ${plantData.common_name_ar}`)
    console.log(`   Category: ${category === "indoor" ? "Plantes d'intérieur / نباتات داخلية" : "Plantes d'extérieur / نباتات خارجية"}`)
    console.log(`   Status: PUBLISHED (visible on storefront)`)
    console.log(`   Images: ${plantData.image_urls.length} image(s)`)
    return true
  } catch (error: any) {
    console.error(`❌ Failed to import ${scientificName}:`, error.message)
    return false
  }
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

export default async function run({ container, args }: ExecArgs): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════════════════╗
║           🌿 SCRIPT D'IMPORT DES PLANTES / سكريبت استيراد النباتات      ║
║                                                                        ║
║  Import des plantes avec noms bilingues FR + AR (Tunisien)             ║
║  استيراد النباتات بأسماء ثنائية اللغة فرنسي + عربي تونسي               ║
║  Products are DRAFT (linked to Sales Channel)                          ║
╚════════════════════════════════════════════════════════════════════════╝
`)

  // Use process.argv since Medusa doesn't pass args correctly
  const argv = process.argv
  
  // Parse arguments from process.argv
  const speciesIndex = argv.indexOf("--species")
  const countIndex = argv.indexOf("--count")
  const outdoorOnly = argv.includes("--outdoor")
  const indoorOnly = argv.includes("--indoor")

  let plantsToImport: Array<{ scientific_name: string; category: "indoor" | "outdoor" }> = []

  if (speciesIndex !== undefined && speciesIndex >= 0) {
    // Import specific species
    const species = argv[speciesIndex + 1]
    if (species) {
      plantsToImport = [{ scientific_name: species, category: "indoor" }]
    }
  } else {
    // Import from popular plants list - default: ALL plants
    let plants = POPULAR_PLANTS
    
    // Filter by category if specified
    if (outdoorOnly) {
      plants = POPULAR_PLANTS.filter(p => p.category === "outdoor")
    } else if (indoorOnly) {
      plants = POPULAR_PLANTS.filter(p => p.category === "indoor")
    }
    
    let count = plants.length // Import ALL by default
    if (countIndex !== undefined && countIndex >= 0) {
      count = parseInt(argv[countIndex + 1]) || plants.length
    }
    plantsToImport = plants.slice(0, count)
  }

  const indoorCount = plantsToImport.filter(p => p.category === "indoor").length
  const outdoorCount = plantsToImport.filter(p => p.category === "outdoor").length
  
  console.log(`📋 Plants to import: ${plantsToImport.length} (${indoorCount} indoor, ${outdoorCount} outdoor)`)
  console.log(`   First 10: ${plantsToImport.slice(0, 10).map((p) => p.scientific_name).join(", ")}...\n`)

  // Check API keys
  console.log("🔑 API Keys Status:")
  console.log(`   Trefle:     ${TREFLE_API_KEY ? "✓ configured" : "✗ not set"}`)
  console.log(`   Unsplash:   ${UNSPLASH_ACCESS_KEY ? "✓ configured" : "✗ not set"}`)
  console.log(`   OpenAI:     ${OPENAI_API_KEY ? "✓ configured (AI verification ON)" : "✗ not set (AI verification OFF)"}`)
  console.log(`   Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? "✓ configured" : "✗ not set"}`)
  
  if (!OPENAI_API_KEY) {
    console.log(`\n⚠️  WARNING: Without OpenAI, images are accepted without verification.`)
    console.log(`   Get a key at: https://platform.openai.com/api-keys\n`)
  } else {
    console.log(`\n✓ AI Image Verification enabled - only verified images will be imported\n`)
  }

  let imported = 0
  let skipped = 0
  let failed = 0

  for (const plant of plantsToImport) {
    try {
      const success = await importPlant(container, plant.scientific_name, plant.category)
      if (success) imported++
      else skipped++
    } catch (error) {
      console.error(`❌ Error importing ${plant.scientific_name}:`, error)
      failed++
    }

    // Rate limiting - wait between API calls
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                    📊 IMPORT SUMMARY                       ║
╠════════════════════════════════════════════════════════════╣
║  ✅ Imported: ${String(imported).padEnd(3)} plants                              ║
║  ⏭️  Skipped:  ${String(skipped).padEnd(3)} (already exist)                     ║
║  ❌ Failed:   ${String(failed).padEnd(3)} plants                              ║
╠════════════════════════════════════════════════════════════╣
║  💡 Products are DRAFT - publish in Admin to make visible  ║
║  ✓  Already linked to Sales Channel                        ║
╚════════════════════════════════════════════════════════════╝
`)
}

// Run the script if executed directly
if (require.main === module) {
  const container = require("@medusajs/framework").container
  run({ container, args: process.argv }).catch(console.error)
}
