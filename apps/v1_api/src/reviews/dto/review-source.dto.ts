import { IsIn, IsUUID } from 'class-validator';

export class ReviewSourceParamsDto {
  @IsIn(['match', 'team_match'])
  sourceType!: 'match' | 'team_match';

  @IsUUID()
  sourceId!: string;
}
