import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { V1AuthGuard } from '../auth/v1-auth.guard';
import { V1AuthUser } from '../auth/v1-auth-user';
import {
  ApproveMatchApplicationDto,
  RejectMatchApplicationDto,
  WithdrawMatchApplicationDto,
} from './dto/match-application.dto';
import { MatchesService } from './matches.service';

@Controller('match-applications')
@UseGuards(V1AuthGuard)
export class MatchApplicationsController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post(':applicationId/withdraw')
  withdraw(
    @CurrentUser() user: V1AuthUser,
    @Param('applicationId') applicationId: string,
    @Body() dto: WithdrawMatchApplicationDto,
  ) {
    return this.matchesService.withdrawApplication(user, applicationId, dto);
  }

  @Post(':applicationId/approve')
  approve(
    @CurrentUser() user: V1AuthUser,
    @Param('applicationId') applicationId: string,
    @Body() dto: ApproveMatchApplicationDto,
  ) {
    return this.matchesService.approveApplication(user, applicationId, dto);
  }

  @Post(':applicationId/reject')
  reject(
    @CurrentUser() user: V1AuthUser,
    @Param('applicationId') applicationId: string,
    @Body() dto: RejectMatchApplicationDto,
  ) {
    return this.matchesService.rejectApplication(user, applicationId, dto);
  }
}
