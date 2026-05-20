import { LoginPageView } from '@/components/auth/auth-page';
import { DevLoginPanel } from '@/components/auth/dev-login-panel';
import { SessionEntryGate } from '@/components/auth/session-entry-gate';
import { getLoginViewModel } from '@/components/auth/auth.view-model';

export default function LoginPage() {
  return (
    <SessionEntryGate mode="login">
      <LoginPageView devLogin={<DevLoginPanel />} model={getLoginViewModel()} />
    </SessionEntryGate>
  );
}
