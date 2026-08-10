import NewsArticlePage from "@/components/intelligence/NewsArticlePage"

export default async function NewsArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <NewsArticlePage id={id} />
}
