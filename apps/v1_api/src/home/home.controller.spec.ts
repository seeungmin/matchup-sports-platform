import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

describe('HomeController', () => {
  const homeService = {
    getHome: jest.fn(),
    getRecommendations: jest.fn(),
  };

  let controller: HomeController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        { provide: HomeService, useValue: homeService },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = moduleRef.get(HomeController);
  });

  it('returns the home aggregate for guests', async () => {
    homeService.getHome.mockResolvedValue({
      viewer: { authenticated: false, displayName: null, onboardingStatus: null },
      recommendations: [],
    });

    await expect(controller.getHome(undefined, {})).resolves.toEqual({
      viewer: { authenticated: false, displayName: null, onboardingStatus: null },
      recommendations: [],
    });
  });

  it('returns derived recommendations', async () => {
    homeService.getRecommendations.mockResolvedValue({
      items: [{ matchId: 'match-1', title: '러닝 매치' }],
      derived: true,
    });

    await expect(controller.getRecommendations(undefined, { limit: 5 })).resolves.toEqual({
      items: [{ matchId: 'match-1', title: '러닝 매치' }],
      derived: true,
    });
  });
});
