import { NotificationsPageView } from '@/components/community/community-page';
import { getNotificationsViewModel } from '@/components/community/community.view-model';

export default function NotificationsPage() {
  return <NotificationsPageView model={getNotificationsViewModel()} />;
}
