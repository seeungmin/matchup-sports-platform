import { MyTeamsPageView } from '@/components/my/my-page';
import { myTeamsModel } from '@/components/my/my.view-model';

export default function MyTeamsPage() {
  return <MyTeamsPageView model={myTeamsModel} />;
}
