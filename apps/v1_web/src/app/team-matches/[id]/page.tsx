import { TeamMatchDetailPageClient } from '@/components/team-matches/team-matches-client';

export default async function TeamMatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeamMatchDetailPageClient teamMatchId={id} />;
}
