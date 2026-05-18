import { Module } from '@nestjs/common';
import { OptionalV1AuthGuard } from '../auth/optional-v1-auth.guard';
import { V1AuthGuard } from '../auth/v1-auth.guard';
import { MatchApplicationsController } from './match-applications.controller';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  controllers: [MatchesController, MatchApplicationsController],
  providers: [MatchesService, OptionalV1AuthGuard, V1AuthGuard],
})
export class MatchesModule {}
