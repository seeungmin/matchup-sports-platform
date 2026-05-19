import { SettingsPageView } from '@/components/my/my-page';
import { settingsModel } from '@/components/my/my.view-model';

export default function MySettingsPage() {
  return <SettingsPageView model={settingsModel} />;
}
