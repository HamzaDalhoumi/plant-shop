/**
 * Publish All Products Script
 * 
 * Updates all products from DRAFT to PUBLISHED status
 * so they become visible on the storefront.
 * 
 * Usage:
 *   npx medusa exec ./src/scripts/publish-all-products.ts
 */

import { ExecArgs } from "@medusajs/framework/types"
import { Modules, ProductStatus } from "@medusajs/framework/utils"

export default async function publishAllProducts({ container }: ExecArgs) {
  console.log("╔════════════════════════════════════════════════════════════╗")
  console.log("║           PUBLISH ALL PRODUCTS                             ║")
  console.log("╚════════════════════════════════════════════════════════════╝")
  
  const productModule = container.resolve(Modules.PRODUCT)
  
  // Get all products
  const [products] = await productModule.listAndCountProducts({}, {
    take: 1000,
    select: ["id", "title", "status"]
  })
  
  console.log(`\n📦 Found ${products.length} products total`)
  
  // Filter draft products
  const draftProducts = products.filter((p: any) => p.status === ProductStatus.DRAFT)
  console.log(`📝 ${draftProducts.length} products are in DRAFT status`)
  
  if (draftProducts.length === 0) {
    console.log("✅ All products are already published!")
    return
  }
  
  // Publish each product
  let published = 0
  let failed = 0
  
  for (const product of draftProducts) {
    try {
      await productModule.updateProducts(product.id, {
        status: ProductStatus.PUBLISHED
      })
      published++
      console.log(`✅ Published: ${(product as any).title}`)
    } catch (error: any) {
      failed++
      console.log(`❌ Failed to publish ${(product as any).title}: ${error.message}`)
    }
  }
  
  console.log("\n╔════════════════════════════════════════════════════════════╗")
  console.log(`║  ✅ Published: ${published} products                              ║`)
  if (failed > 0) {
    console.log(`║  ❌ Failed: ${failed} products                                 ║`)
  }
  console.log("║  🌿 Products are now visible on the storefront!             ║")
  console.log("╚════════════════════════════════════════════════════════════╝")
}
