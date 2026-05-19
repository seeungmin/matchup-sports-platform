import { TeamMatchCreatePageView } from '@/components/team-matches/team-matches-page';
import { getTeamMatchCreateViewModel } from '@/components/team-matches/team-matches.view-model';

export default function TeamMatchCreateTeamPage() {
  return <TeamMatchCreatePageView model={getTeamMatchCreateViewModel('team')} />;
}
