import { MatchCreatePageView } from '@/components/matches/matches-page';
import { getMatchCreateViewModel } from '@/components/matches/matches.view-model';

export default function MatchCreateConfirmPage() {
  return <MatchCreatePageView model={getMatchCreateViewModel('confirm')} />;
}
