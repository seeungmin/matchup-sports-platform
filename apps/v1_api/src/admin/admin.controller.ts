import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { V1AuthGuard } from '../auth/v1-auth.guard';
import { V1AuthUser } from '../auth/v1-auth-user';
import {
  AdminLogsQueryDto,
  AdminOverviewQueryDto,
  ChangeMatchStatusDto,
  ChangeTeamMatchStatusDto,
  ChangeTeamStatusDto,
  ChangeUserStatusDto,
} from './dto/admin.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(V1AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('me')
  me(@CurrentUser() user: V1AuthUser) {
    return this.adminService.me(user);
  }

  @Get('overview')
  overview(@CurrentUser() user: V1AuthUser, @Query() query: AdminOverviewQueryDto) {
    return this.adminService.overview(user, query);
  }

  @Post('users/:userId/status')
  changeUserStatus(
    @CurrentUser() user: V1AuthUser,
    @Param('userId') userId: string,
    @Body() dto: ChangeUserStatusDto,
  ) {
    return this.adminService.changeUserStatus(user, userId, dto);
  }

  @Post('matches/:matchId/status')
  changeMatchStatus(
    @CurrentUser() user: V1AuthUser,
    @Param('matchId') matchId: string,
    @Body() dto: ChangeMatchStatusDto,
  ) {
    return this.adminService.changeMatchStatus(user, matchId, dto);
  }

  @Post('teams/:teamId/status')
  changeTeamStatus(
    @CurrentUser() user: V1AuthUser,
    @Param('teamId') teamId: string,
    @Body() dto: ChangeTeamStatusDto,
  ) {
    return this.adminService.changeTeamStatus(user, teamId, dto);
  }

  @Post('team-matches/:teamMatchId/status')
  changeTeamMatchStatus(
    @CurrentUser() user: V1AuthUser,
    @Param('teamMatchId') teamMatchId: string,
    @Body() dto: ChangeTeamMatchStatusDto,
  ) {
    return this.adminService.changeTeamMatchStatus(user, teamMatchId, dto);
  }

  @Get('action-logs')
  actionLogs(@CurrentUser() user: V1AuthUser, @Query() query: AdminLogsQueryDto) {
    return this.adminService.actionLogs(user, query);
  }

  @Get('status-change-logs')
  statusChangeLogs(@CurrentUser() user: V1AuthUser, @Query() query: AdminLogsQueryDto) {
    return this.adminService.statusChangeLogs(user, query);
  }
}
