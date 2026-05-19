import { TeamMatchCreatePageView } from '@/components/team-matches/team-matches-page';
import { getTeamMatchCreateViewModel } from '@/components/team-matches/team-matches.view-model';

export default function TeamMatchEditPage() {
  return <TeamMatchCreatePageView model={getTeamMatchCreateViewModel('edit')} />;
}
