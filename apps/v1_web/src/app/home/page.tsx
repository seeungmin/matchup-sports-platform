import { HomePageView } from '@/components/home/home-page';
import { getHomeViewModel } from '@/components/home/home.view-model';

export default function HomePage() {
  return <HomePageView model={getHomeViewModel()} />;
}
