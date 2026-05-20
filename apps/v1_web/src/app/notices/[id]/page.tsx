import { NoticeDetailPageClient } from '@/components/notices/notices-client';

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NoticeDetailPageClient noticeId={id} />;
}
