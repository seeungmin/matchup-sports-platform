import { TeamDetailPageClient } from '@/components/teams/teams-client';

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeamDetailPageClient teamId={id} />;
}
