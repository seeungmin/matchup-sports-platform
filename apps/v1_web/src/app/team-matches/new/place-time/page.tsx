import { TeamMatchCreatePageView } from '@/components/team-matches/team-matches-page';
import { getTeamMatchCreateViewModel } from '@/components/team-matches/team-matches.view-model';

export default function TeamMatchCreatePlaceTimePage() {
  return <TeamMatchCreatePageView model={getTeamMatchCreateViewModel('place-time')} />;
}
