import { TeamFormPageView } from '@/components/teams/teams-page';
import { getTeamFormViewModel } from '@/components/teams/teams.view-model';

export default function TeamCreatePage() {
  return <TeamFormPageView model={getTeamFormViewModel('create')} />;
}
