/**
 * Delete All Products Script
 * Supprime tous les produits de la base de données
 */

import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function run({ container }: ExecArgs): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     🗑️  SUPPRESSION DE TOUS LES PRODUITS                   ║
╚════════════════════════════════════════════════════════════╝
`)

  const productModule = container.resolve(Modules.PRODUCT)
  
  // Get all products
  const products = await productModule.listProducts({}, { take: 1000 })
  
  console.log(`📦 Nombre de produits trouvés: ${products.length}`)
  
  if (products.length === 0) {
    console.log("✅ Aucun produit à supprimer")
    return
  }
  
  // Delete each product
  let deleted = 0
  for (const product of products) {
    try {
      await productModule.deleteProducts([product.id])
      deleted++
      console.log(`🗑️  Supprimé: ${product.title}`)
    } catch (error: any) {
      console.error(`❌ Erreur pour ${product.title}:`, error.message)
    }
  }
  
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     ✅ SUPPRESSION TERMINÉE                                 ║
║     ${String(deleted).padEnd(3)} produits supprimés                            ║
╚════════════════════════════════════════════════════════════╝
`)
}
