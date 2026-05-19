import { MatchCreatePageView } from '@/components/matches/matches-page';
import { getMatchCreateViewModel } from '@/components/matches/matches.view-model';

export default function NewMatchPage() {
  return <MatchCreatePageView model={getMatchCreateViewModel('info')} />;
}
