import { MatchCreatePageView } from '@/components/matches/matches-page';
import { getMatchCreateViewModel } from '@/components/matches/matches.view-model';

export default function MatchEditPage() {
  return <MatchCreatePageView model={getMatchCreateViewModel('edit')} />;
}
