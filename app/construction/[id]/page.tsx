import ConstructionDetailPage from "@/components/markets/ConstructionDetailPage"
import { constructionProjects } from "@/lib/data/construction"

export default async function ConstructionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ConstructionDetailPage id={id} />
}

// Prerender every canonical project — stays in sync with lib/data
export async function generateStaticParams() {
  return constructionProjects.map(p => ({ id: p.id }))
}
