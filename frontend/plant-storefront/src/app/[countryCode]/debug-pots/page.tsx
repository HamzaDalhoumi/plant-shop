import { getCompatiblePotsForPlant } from "@lib/data/compatibility"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export default async function DebugPotsPage() {
  const region = await getRegion("tn")
  
  if (!region) {
    return <div>Region not found</div>
  }

  // Get Jasmin product
  const { response } = await listProducts({
    queryParams: { handle: "jasminum-officinale" },
    regionId: region.id,
  })
  
  const jasmin = response.products[0]
  
  if (!jasmin) {
    return <div>Jasmin product not found</div>
  }

  // Get compatible pots
  const compatiblePots = await getCompatiblePotsForPlant({
    plant: jasmin,
    countryCode: "tn",
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Compatible Pots</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Plant: {jasmin.title}</h2>
        <p>Handle: {jasmin.handle}</p>
        <p>Metadata: {JSON.stringify(jasmin.metadata)}</p>
        <p>Thumbnail: {jasmin.thumbnail}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Compatible Pots Found: {compatiblePots.length}</h2>
      
      {compatiblePots.length === 0 ? (
        <p className="text-red-500">No compatible pots found!</p>
      ) : (
        <div className="space-y-4">
          {compatiblePots.map((pot, i) => (
            <div key={i} className="p-4 border rounded">
              <h3 className="font-semibold">{pot.product.title}</h3>
              <p>Handle: {pot.product.handle}</p>
              <p>Thumbnail: {pot.product.thumbnail}</p>
              <p>Metadata: {JSON.stringify(pot.product.metadata)}</p>
              <p>Matching Variants: {pot.matchingVariants.length}</p>
              <ul className="ml-4 list-disc">
                {pot.matchingVariants.map((v) => (
                  <li key={v.id}>{v.title} - ID: {v.id}</li>
                ))}
              </ul>
              {pot.product.thumbnail && (
                <img 
                  src={pot.product.thumbnail} 
                  alt={pot.product.title} 
                  className="w-32 h-32 object-contain mt-2"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
