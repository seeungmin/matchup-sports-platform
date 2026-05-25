import { Suspense } from 'react';
import { TeamListPageClient } from '@/components/teams/teams-client';

export default function TeamsPage() {
  return (
    <Suspense fallback={null}>
      <TeamListPageClient />
    </Suspense>
  );
}
