import { V1AccountStatus, V1OnboardingStatus } from '@prisma/client';

export interface V1AuthUser {
  id: string;
  email: string | null;
  accountStatus: V1AccountStatus;
  onboardingStatus: V1OnboardingStatus;
}
