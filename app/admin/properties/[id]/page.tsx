import PropertyEditor from "@/components/admin/PropertyEditor"

export default async function AdminPropertyEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PropertyEditor id={id} />
}
