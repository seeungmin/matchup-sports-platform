import { MyHomePageView } from '@/components/my/my-page';
import { myHomeModel } from '@/components/my/my.view-model';

export default function MyPage() {
  return <MyHomePageView model={myHomeModel} />;
}
