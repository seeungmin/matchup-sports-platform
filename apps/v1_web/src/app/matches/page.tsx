import { MatchListPageView } from '@/components/matches/matches-page';
import { getMatchListViewModel } from '@/components/matches/matches.view-model';

export default function MatchesPage() {
  return <MatchListPageView model={getMatchListViewModel()} />;
}
