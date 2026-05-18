import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateTeamJoinApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string | null;
}

export class WithdrawTeamJoinApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string | null;
}

export class ListTeamJoinApplicationsQueryDto {
  @IsOptional()
  @IsIn(['requested', 'approved', 'rejected', 'withdrawn', 'expired'])
  status?: 'requested' | 'approved' | 'rejected' | 'withdrawn' | 'expired';

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class ApproveTeamJoinApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string | null;
}

export class RejectTeamJoinApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string | null;
}
