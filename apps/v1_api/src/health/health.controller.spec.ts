import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  it('returns the v1 health payload', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            check: jest.fn().mockResolvedValue({
              service: 'v1_api',
              checks: { db: true },
            }),
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(HealthController);

    await expect(controller.check()).resolves.toEqual({
      service: 'v1_api',
      checks: { db: true },
    });
  });
});
