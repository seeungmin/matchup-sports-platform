import { NotificationSettingsPageView } from '@/components/my/my-page';
import { notificationSettingsModel } from '@/components/my/my.view-model';

export default function MyNotificationSettingsPage() {
  return <NotificationSettingsPageView model={notificationSettingsModel} />;
}
