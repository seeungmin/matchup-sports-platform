import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { V1AuthUser } from '../auth/v1-auth-user';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotificationsQueryDto,
  ReadAllNotificationsDto,
  UpdateNotificationPreferencesDto,
} from './dto/notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: V1AuthUser, query: NotificationsQueryDto) {
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
    const where: Prisma.V1NotificationWhereInput = {
      recipientUserId: user.id,
      ...(query.status === 'read' ? { readAt: { not: null } } : {}),
      ...(query.status === 'unread' || !query.status || query.status === 'created' ? { readAt: null } : {}),
      ...(query.type ? { targetType: query.type as never } : {}),
    };
    const [items, unreadCount] = await Promise.all([
      this.prisma.v1Notification.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        take: limit + 1,
        ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      }),
      this.prisma.v1Notification.count({ where: { recipientUserId: user.id, readAt: null } }),
    ]);
    const pageItems = items.slice(0, limit);
    const hasNext = items.length > limit;

    return {
      items: pageItems.map((notification) => ({
        notificationId: notification.id,
        type: notification.targetType,
        title: notification.title,
        body: notification.body,
        target: {
          type: notification.targetType,
          id: notification.targetId,
          route: notification.deepLink,
        },
        status: notification.readAt ? 'read' : 'created',
        readAt: notification.readAt,
        createdAt: notification.createdAt,
      })),
      unreadCount,
      pageInfo: { nextCursor: hasNext ? pageItems.at(-1)?.id ?? null : null, hasNext },
    };
  }

  async read(user: V1AuthUser, notificationId: string) {
    const notification = await this.prisma.v1Notification.findUnique({ where: { id: notificationId } });
    if (!notification) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Notification was not found' });
    if (notification.recipientUserId !== user.id) {
      throw new ForbiddenException({ code: 'PERMISSION_DENIED', message: 'Notification access is denied' });
    }
    const readAt = notification.readAt ?? new Date();
    const updated = notification.readAt
      ? notification
      : await this.prisma.v1Notification.update({ where: { id: notification.id }, data: { readAt } });
    return { notificationId: updated.id, status: 'read', readAt: updated.readAt ?? readAt };
  }

  async readAll(user: V1AuthUser, dto: ReadAllNotificationsDto) {
    const readAt = new Date();
    const result = await this.prisma.v1Notification.updateMany({
      where: {
        recipientUserId: user.id,
        readAt: null,
        ...(dto.type ? { targetType: dto.type as never } : {}),
      },
      data: { readAt },
    });
    const unreadCount = await this.prisma.v1Notification.count({
      where: { recipientUserId: user.id, readAt: null },
    });
    return { updatedCount: result.count, readAt, unreadCount };
  }

  async preferences(user: V1AuthUser) {
    const preferences = await this.prisma.v1NotificationPreference.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
    return toPreferencesResponse(preferences);
  }

  async updatePreferences(user: V1AuthUser, dto: UpdateNotificationPreferencesDto) {
    const preferences = await this.prisma.v1NotificationPreference.upsert({
      where: { userId: user.id },
      update: {
        ...(dto.importantEnabled === undefined ? {} : { importantEnabled: dto.importantEnabled }),
        ...(dto.activityEnabled === undefined ? {} : { activityEnabled: dto.activityEnabled }),
        ...(dto.marketingEnabled === undefined ? {} : { marketingEnabled: dto.marketingEnabled }),
      },
      create: {
        userId: user.id,
        importantEnabled: dto.importantEnabled ?? true,
        activityEnabled: dto.activityEnabled ?? true,
        marketingEnabled: dto.marketingEnabled ?? false,
      },
    });
    return toPreferencesResponse(preferences);
  }
}

function toPreferencesResponse(preferences: {
  importantEnabled: boolean;
  activityEnabled: boolean;
  marketingEnabled: boolean;
  updatedAt: Date;
}) {
  return {
    importantEnabled: preferences.importantEnabled,
    activityEnabled: preferences.activityEnabled,
    marketingEnabled: preferences.marketingEnabled,
    updatedAt: preferences.updatedAt,
  };
}
