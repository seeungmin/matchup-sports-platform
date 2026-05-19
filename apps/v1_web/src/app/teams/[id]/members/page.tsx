import { TeamMembersPageView } from '@/components/teams/teams-page';
import { getTeamMembersViewModel } from '@/components/teams/teams.view-model';

export default function TeamMembersPage() {
  return <TeamMembersPageView model={getTeamMembersViewModel()} />;
}
