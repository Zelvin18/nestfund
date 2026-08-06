import PropertyDetailPage from "@/components/property/PropertyDetailPage"

// Next.js 15: params is a Promise
export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PropertyDetailPage id={id} />
}

export async function generateStaticParams() {
  return [
    { id: "sunrise-apartments" },
    { id: "green-heights" },
    { id: "acacia-office-park" },
    { id: "lake-view-residences" },
  ]
}
