import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class CreateTeamMatchApplicationDto {
  @IsUUID()
  applicantTeamId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string | null;
}

export class WithdrawTeamMatchApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string | null;
}

export class ListTeamMatchApplicationsQueryDto {
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

export class ApproveTeamMatchApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string | null;
}

export class RejectTeamMatchApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string | null;
}
