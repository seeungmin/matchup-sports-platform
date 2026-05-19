import { MatchCreatePageView } from '@/components/matches/matches-page';
import { getMatchCreateViewModel } from '@/components/matches/matches.view-model';

export default function MatchCreatePlaceTimePage() {
  return <MatchCreatePageView model={getMatchCreateViewModel('place-time')} />;
}
