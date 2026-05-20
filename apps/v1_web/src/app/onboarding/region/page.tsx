import { OnboardingPageView } from '@/components/auth/auth-page';
import { getOnboardingViewModel } from '@/components/auth/auth.view-model';

export default function OnboardingRegionPage() {
  return <OnboardingPageView model={getOnboardingViewModel('region')} />;
}
