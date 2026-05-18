import { Module } from '@nestjs/common';
import { OptionalV1AuthGuard } from '../auth/optional-v1-auth.guard';
import { V1AuthGuard } from '../auth/v1-auth.guard';
import { TeamMatchesController } from './team-matches.controller';
import { TeamMatchesService } from './team-matches.service';

@Module({
  controllers: [TeamMatchesController],
  providers: [TeamMatchesService, OptionalV1AuthGuard, V1AuthGuard],
})
export class TeamMatchesModule {}
