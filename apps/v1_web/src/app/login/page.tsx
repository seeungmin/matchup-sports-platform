import { LoginPageView } from '@/components/auth/auth-page';
import { getLoginViewModel } from '@/components/auth/auth.view-model';

export default function LoginPage() {
  return <LoginPageView model={getLoginViewModel()} />;
}
