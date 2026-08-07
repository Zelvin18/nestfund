import ConstructionDetailPage from "@/components/markets/ConstructionDetailPage"

export default async function ConstructionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ConstructionDetailPage id={id} />
}

export async function generateStaticParams() {
  return [
    { id: "ibis-residences-ii" },
    { id: "kololo-towers-ii" },
    { id: "naalya-eco-park" },
    { id: "muyenga-hillside" },
  ]
}
