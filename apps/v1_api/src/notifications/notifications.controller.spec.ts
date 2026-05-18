import { Test } from '@nestjs/testing';
import { V1AuthGuard } from '../auth/v1-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

const user = {
  id: 'user-1',
  email: 'applicant@teameet.v1',
  accountStatus: 'active' as const,
  onboardingStatus: 'completed' as const,
};

describe('NotificationsController', () => {
  const notificationsService = {
    list: jest.fn(),
    read: jest.fn(),
    readAll: jest.fn(),
    preferences: jest.fn(),
    updatePreferences: jest.fn(),
  };

  let controller: NotificationsController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: notificationsService },
        { provide: PrismaService, useValue: {} },
        { provide: V1AuthGuard, useValue: { canActivate: jest.fn(() => true) } },
      ],
    }).compile();
    controller = moduleRef.get(NotificationsController);
  });

  it('returns notifications', async () => {
    notificationsService.list.mockResolvedValue({ items: [{ notificationId: 'notification-1' }] });
    await expect(controller.list(user, { status: 'unread' })).resolves.toEqual({
      items: [{ notificationId: 'notification-1' }],
    });
  });

  it('marks notification read', async () => {
    notificationsService.read.mockResolvedValue({ notificationId: 'notification-1', status: 'read' });
    await expect(controller.read(user, 'notification-1')).resolves.toEqual({
      notificationId: 'notification-1',
      status: 'read',
    });
  });

  it('marks all notifications read', async () => {
    notificationsService.readAll.mockResolvedValue({ updatedCount: 2, unreadCount: 0 });
    await expect(controller.readAll(user, { type: 'match' })).resolves.toEqual({
      updatedCount: 2,
      unreadCount: 0,
    });
  });

  it('returns preferences', async () => {
    notificationsService.preferences.mockResolvedValue({ importantEnabled: true });
    await expect(controller.preferences(user)).resolves.toEqual({ importantEnabled: true });
  });

  it('updates preferences', async () => {
    notificationsService.updatePreferences.mockResolvedValue({ marketingEnabled: true });
    await expect(controller.updatePreferences(user, { marketingEnabled: true })).resolves.toEqual({
      marketingEnabled: true,
    });
  });
});
