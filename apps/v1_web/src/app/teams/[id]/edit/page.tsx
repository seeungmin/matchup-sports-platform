import { TeamFormPageView } from '@/components/teams/teams-page';
import { getTeamFormViewModel } from '@/components/teams/teams.view-model';

export default function TeamEditPage() {
  return <TeamFormPageView model={getTeamFormViewModel('edit')} />;
}
