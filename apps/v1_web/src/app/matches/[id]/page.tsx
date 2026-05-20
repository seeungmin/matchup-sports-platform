import { MatchDetailPageClient } from '@/components/matches/matches-client';

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchDetailPageClient matchId={id} />;
}
