import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildOnboardingSummary } from '../onboarding/onboarding-summary';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.prisma.v1User.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        onboardingProgress: true,
        sportPreferences: {
          include: {
            sport: true,
            sportLevel: true,
          },
        },
        regions: {
          include: { region: true },
        },
        reputationSummary: true,
        termsConsents: {
          where: {
            revokedAt: null,
            termsDocument: {
              isRequired: true,
              status: 'published',
            },
          },
          select: { id: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'V1 user was not found',
      });
    }

    if (user.accountStatus === 'deleted') {
      throw new ForbiddenException({
        code: 'PERMISSION_DENIED',
        message: 'Deleted account cannot access v1 API',
      });
    }

    const onboarding = buildOnboardingSummary({
      onboardingStatus: user.onboardingStatus,
      currentStep: user.onboardingProgress?.currentStep ?? null,
      sportPreferences: user.sportPreferences,
      regions: user.regions,
      hasRequiredTerms: user.termsConsents.length > 0,
      hasProfile: Boolean(user.profile?.nickname),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        accountStatus: user.accountStatus,
        onboardingStatus: user.onboardingStatus,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
      profile: {
        displayName: user.profile?.displayName ?? user.profile?.nickname ?? 'Teameet user',
        nickname: user.profile?.nickname ?? null,
        avatarUrl: user.profile?.profileImageUrl ?? null,
        profileVisibility: user.profile?.visibility ?? 'public',
        regionSummary: user.profile?.displayRegion ?? user.regions[0]?.region.name ?? null,
      },
      onboarding,
      reputation: {
        mannerScore: user.reputationSummary?.mannerScore
          ? Number(user.reputationSummary.mannerScore)
          : null,
        reviewCount: user.reputationSummary?.reviewCount ?? 0,
        trustState: user.reputationSummary?.trustState ?? 'none',
      },
    };
  }
}
