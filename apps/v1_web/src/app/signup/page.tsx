import { SignupPageView } from '@/components/auth/auth-page';
import { getSignupViewModel } from '@/components/auth/auth.view-model';

export default function SignupPage() {
  return <SignupPageView model={getSignupViewModel()} />;
}
