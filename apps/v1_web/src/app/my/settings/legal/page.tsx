import { LegalPageView } from '@/components/my/my-page';
import { settingsModel } from '@/components/my/my.view-model';

export default function MyLegalSettingsPage() {
  return <LegalPageView model={settingsModel} />;
}
