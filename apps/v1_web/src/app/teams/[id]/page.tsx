import { TeamDetailPageView } from '@/components/teams/teams-page';
import { getTeamDetailViewModel } from '@/components/teams/teams.view-model';

export default function TeamDetailPage() {
  return <TeamDetailPageView model={getTeamDetailViewModel()} />;
}
