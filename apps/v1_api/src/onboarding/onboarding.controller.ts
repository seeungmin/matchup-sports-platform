import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { V1AuthGuard } from '../auth/v1-auth.guard';
import { V1AuthUser } from '../auth/v1-auth-user';
import { DeferOnboardingDto } from './dto/defer-onboarding.dto';
import { UpdateOnboardingPreferencesDto } from './dto/update-onboarding-preferences.dto';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
@UseGuards(V1AuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get()
  get(@CurrentUser() user: V1AuthUser) {
    return this.onboardingService.get(user.id);
  }

  @Patch('preferences')
  updatePreferences(
    @CurrentUser() user: V1AuthUser,
    @Body() dto: UpdateOnboardingPreferencesDto,
  ) {
    return this.onboardingService.updatePreferences(user.id, dto);
  }

  @Post('complete')
  complete(@CurrentUser() user: V1AuthUser) {
    return this.onboardingService.complete(user.id);
  }

  @Post('defer')
  defer(@CurrentUser() user: V1AuthUser, @Body() dto: DeferOnboardingDto) {
    return this.onboardingService.defer(user.id, dto.reason ?? 'unknown');
  }
}
