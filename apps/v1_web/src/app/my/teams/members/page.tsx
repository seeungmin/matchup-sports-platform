import { MyTeamMembersPageView } from '@/components/my/my-page';
import { myTeamMembersModel } from '@/components/my/my.view-model';

export default function MyTeamMembersPage() {
  return <MyTeamMembersPageView model={myTeamMembersModel} />;
}
