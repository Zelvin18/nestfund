import PropertyDetailPage from "@/components/property/PropertyDetailPage"
import { rentalProperties } from "@/lib/data/rentals"

// Next.js 15: params is a Promise
export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PropertyDetailPage id={id} />
}

// Prerender every canonical property — stays in sync with lib/data
export async function generateStaticParams() {
  return rentalProperties.map(p => ({ id: p.id }))
}
