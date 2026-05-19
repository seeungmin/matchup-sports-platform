import { MatchCreatePageView } from '@/components/matches/matches-page';
import { getMatchCreateViewModel } from '@/components/matches/matches.view-model';

export default function MatchCreateCompletePage() {
  return <MatchCreatePageView model={getMatchCreateViewModel('complete')} />;
}
