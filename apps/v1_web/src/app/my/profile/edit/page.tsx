import { ProfileEditPageView } from '@/components/my/my-page';
import { profileEditModel } from '@/components/my/my.view-model';

export default function MyProfileEditPage() {
  return <ProfileEditPageView model={profileEditModel} />;
}
