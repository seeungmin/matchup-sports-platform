import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  it('returns the current v1 user summary', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            me: jest.fn().mockResolvedValue({
              user: { id: 'user-1', email: 'host@teameet.v1' },
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    const controller = moduleRef.get(AuthController);

    await expect(
      controller.me({
        id: 'user-1',
        email: 'host@teameet.v1',
        accountStatus: 'active',
        onboardingStatus: 'completed',
      }),
    ).resolves.toEqual({
      user: { id: 'user-1', email: 'host@teameet.v1' },
    });
  });
});
