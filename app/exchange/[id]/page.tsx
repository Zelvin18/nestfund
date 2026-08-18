import TradePage from "@/components/exchange/TradePage"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TradePage assetId={id} />
}
