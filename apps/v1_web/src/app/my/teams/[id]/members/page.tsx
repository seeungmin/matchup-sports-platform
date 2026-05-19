import { MyTeamMembersPageView } from '@/components/my/my-page';
import { myTeamMembersModel } from '@/components/my/my.view-model';

export default function MyTeamMembersDetailPage() {
  return <MyTeamMembersPageView model={myTeamMembersModel} />;
}
