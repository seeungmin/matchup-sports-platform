import { TermsPageView } from '@/components/auth/auth-page';
import { getTermsViewModel } from '@/components/auth/auth.view-model';

export default function TermsPage() {
  return <TermsPageView model={getTermsViewModel()} />;
}
