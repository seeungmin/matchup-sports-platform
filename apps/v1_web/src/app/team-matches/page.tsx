import { TeamMatchListPageView } from '@/components/team-matches/team-matches-page';
import { getTeamMatchListViewModel } from '@/components/team-matches/team-matches.view-model';

export default function TeamMatchesPage() {
  return <TeamMatchListPageView model={getTeamMatchListViewModel()} />;
}
