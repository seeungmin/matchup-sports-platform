import { MyMatchesPageView } from '@/components/my/my-page';
import { getMyMatchesModel } from '@/components/my/my.view-model';

export default function MyJoinedMatchesPage() {
  return <MyMatchesPageView model={getMyMatchesModel('joined')} />;
}
