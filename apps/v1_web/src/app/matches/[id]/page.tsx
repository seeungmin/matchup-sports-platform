import { MatchDetailPageView } from '@/components/matches/matches-page';
import { getMatchDetailViewModel } from '@/components/matches/matches.view-model';

export default function MatchDetailPage() {
  return <MatchDetailPageView model={getMatchDetailViewModel()} />;
}
