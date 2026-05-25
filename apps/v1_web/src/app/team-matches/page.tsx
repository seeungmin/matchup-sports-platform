import { Suspense } from 'react';
import { TeamMatchListPageClient } from '@/components/team-matches/team-matches-client';

export default function TeamMatchesPage() {
  return (
    <Suspense fallback={null}>
      <TeamMatchListPageClient />
    </Suspense>
  );
}
