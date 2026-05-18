import { IsIn, IsOptional } from 'class-validator';

export class DeferOnboardingDto {
  @IsOptional()
  @IsIn(['skip_now', 'later', 'unknown'])
  reason?: 'skip_now' | 'later' | 'unknown';
}
