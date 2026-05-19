import { MyMatchesPageView } from '@/components/my/my-page';
import { getMyMatchesModel } from '@/components/my/my.view-model';

export default function MyCreatedMatchesPage() {
  return <MyMatchesPageView model={getMyMatchesModel('created')} />;
}
