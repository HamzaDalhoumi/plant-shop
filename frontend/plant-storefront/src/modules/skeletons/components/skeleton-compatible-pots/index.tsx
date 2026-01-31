import { Container } from "@medusajs/ui"
import repeat from "@lib/util/repeat"

type SkeletonCompatiblePotsProps = {
  mode?: "display" | "selector"
}

export default function SkeletonCompatiblePots({
  mode = "display",
}: SkeletonCompatiblePotsProps) {
  if (mode === "selector") {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="w-32 h-5 bg-gray-100 rounded"></div>
        <div className="w-48 h-4 bg-gray-100 rounded"></div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {repeat(4).map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-24 p-2 rounded-lg border border-gray-100"
            >
              <Container className="aspect-square w-full bg-gray-100" />
              <div className="mt-2 w-full h-3 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
        <div className="w-full h-10 bg-gray-100 rounded"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="w-40 h-6 bg-gray-100 rounded"></div>
        <div className="w-64 h-4 bg-gray-100 rounded"></div>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-4">
        {repeat(4).map((i) => (
          <li key={i}>
            <Container className="aspect-square w-full bg-gray-100" />
            <div className="mt-3 w-3/4 h-4 bg-gray-100 rounded"></div>
            <div className="mt-1 w-1/2 h-3 bg-gray-100 rounded"></div>
            <div className="mt-1 w-1/3 h-4 bg-gray-100 rounded"></div>
          </li>
        ))}
      </ul>
    </div>
  )
}
