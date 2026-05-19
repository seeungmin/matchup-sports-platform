import { MatchCreatePageView } from '@/components/matches/matches-page';
import { getMatchCreateViewModel } from '@/components/matches/matches.view-model';

export default function MatchCreateSportPage() {
  return <MatchCreatePageView model={getMatchCreateViewModel('sport')} />;
}
