import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

const user = {
  id: 'user-1',
  email: 'host@teameet.v1',
  accountStatus: 'active' as const,
  onboardingStatus: 'signup_done' as const,
};

describe('OnboardingController', () => {
  const onboardingService = {
    get: jest.fn(),
    updatePreferences: jest.fn(),
    complete: jest.fn(),
    defer: jest.fn(),
  };

  let controller: OnboardingController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [
        { provide: OnboardingService, useValue: onboardingService },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = moduleRef.get(OnboardingController);
  });

  it('returns onboarding detail', async () => {
    onboardingService.get.mockResolvedValue({
      status: 'signup_done',
      currentStep: 'sport',
      sports: [],
      regions: [],
      missing: ['sports'],
      regionOptional: true,
    });

    await expect(controller.get(user)).resolves.toEqual({
      status: 'signup_done',
      currentStep: 'sport',
      sports: [],
      regions: [],
      missing: ['sports'],
      regionOptional: true,
    });
  });

  it('updates onboarding preferences', async () => {
    const dto = {
      sports: [{ sportId: '00000000-0000-4000-8000-000000000001', levelId: null }],
      regions: [],
      currentStep: 'sport' as const,
    };
    onboardingService.updatePreferences.mockResolvedValue({
      status: 'sport_done',
      currentStep: 'sport',
      canContinue: false,
      missing: ['levels'],
    });

    await expect(controller.updatePreferences(user, dto)).resolves.toEqual({
      status: 'sport_done',
      currentStep: 'sport',
      canContinue: false,
      missing: ['levels'],
    });
  });

  it('completes onboarding', async () => {
    onboardingService.complete.mockResolvedValue({
      status: 'completed',
      next: { route: '/home', reason: 'onboarding_completed' },
      missing: [],
      limited: false,
    });

    await expect(controller.complete(user)).resolves.toEqual({
      status: 'completed',
      next: { route: '/home', reason: 'onboarding_completed' },
      missing: [],
      limited: false,
    });
  });

  it('defers onboarding', async () => {
    onboardingService.defer.mockResolvedValue({
      status: 'deferred',
      next: { route: '/home', reason: 'onboarding_deferred' },
      missing: ['sports'],
      limited: true,
    });

    await expect(controller.defer(user, { reason: 'later' })).resolves.toEqual({
      status: 'deferred',
      next: { route: '/home', reason: 'onboarding_deferred' },
      missing: ['sports'],
      limited: true,
    });
  });
});
