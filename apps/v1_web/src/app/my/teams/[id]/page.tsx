import { MyTeamDetailPageView } from '@/components/my/my-page';
import { getMyTeamDetailModel } from '@/components/my/my.view-model';

export default async function MyTeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MyTeamDetailPageView model={getMyTeamDetailModel(id)} />;
}
