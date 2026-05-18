import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { V1AuthGuard } from '../auth/v1-auth.guard';
import { V1AuthUser } from '../auth/v1-auth-user';
import {
  NotificationsQueryDto,
  ReadAllNotificationsDto,
  UpdateNotificationPreferencesDto,
} from './dto/notifications.dto';
import { NotificationsService } from './notifications.service';

@Controller()
@UseGuards(V1AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('notifications')
  list(@CurrentUser() user: V1AuthUser, @Query() query: NotificationsQueryDto) {
    return this.notificationsService.list(user, query);
  }

  @Patch('notifications/:notificationId/read')
  read(@CurrentUser() user: V1AuthUser, @Param('notificationId') notificationId: string) {
    return this.notificationsService.read(user, notificationId);
  }

  @Post('notifications/read-all')
  readAll(@CurrentUser() user: V1AuthUser, @Body() dto: ReadAllNotificationsDto) {
    return this.notificationsService.readAll(user, dto);
  }

  @Get('notification-preferences')
  preferences(@CurrentUser() user: V1AuthUser) {
    return this.notificationsService.preferences(user);
  }

  @Patch('notification-preferences')
  updatePreferences(@CurrentUser() user: V1AuthUser, @Body() dto: UpdateNotificationPreferencesDto) {
    return this.notificationsService.updatePreferences(user, dto);
  }
}
