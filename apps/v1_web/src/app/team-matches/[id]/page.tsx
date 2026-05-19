import { TeamMatchDetailPageView } from '@/components/team-matches/team-matches-page';
import { getTeamMatchDetailViewModel } from '@/components/team-matches/team-matches.view-model';

export default function TeamMatchDetailPage() {
  return <TeamMatchDetailPageView model={getTeamMatchDetailViewModel()} />;
}
