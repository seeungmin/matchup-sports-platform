import { TeamListPageView } from '@/components/teams/teams-page';
import { getTeamListViewModel } from '@/components/teams/teams.view-model';

export default function TeamsPage() {
  return <TeamListPageView model={getTeamListViewModel()} />;
}
