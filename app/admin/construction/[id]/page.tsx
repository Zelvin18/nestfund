import ConstructionEditor from "@/components/admin/ConstructionEditor"

export default async function AdminConstructionEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ConstructionEditor id={id} />
}
