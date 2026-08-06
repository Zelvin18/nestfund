import PropertyDetailPage from "@/components/property/PropertyDetailPage"

export default function PropertyDetail({ params }: { params: { id: string } }) {
  return <PropertyDetailPage id={params.id} />
}
