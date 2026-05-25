import { Suspense } from 'react';
import { MatchListPageClient } from '@/components/matches/matches-client';

export default function MatchesPage() {
  return (
    <Suspense fallback={null}>
      <MatchListPageClient />
    </Suspense>
  );
}
