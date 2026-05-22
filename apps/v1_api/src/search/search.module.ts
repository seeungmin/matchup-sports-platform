import { Module } from '@nestjs/common';
import { OptionalV1AuthGuard } from '../auth/optional-v1-auth.guard';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, OptionalV1AuthGuard],
})
export class SearchModule {}
