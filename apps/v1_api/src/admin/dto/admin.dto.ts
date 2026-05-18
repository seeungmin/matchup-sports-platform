import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class AdminOverviewQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}

export class ChangeUserStatusDto {
  @IsIn(['active', 'suspended', 'blocked', 'deleted'])
  status!: 'active' | 'suspended' | 'blocked' | 'deleted';

  @IsString()
  @MaxLength(500)
  reason!: string;
}

export class ChangeMatchStatusDto {
  @IsIn(['recruiting', 'closed', 'cancelled', 'completed', 'archived'])
  status!: 'recruiting' | 'closed' | 'cancelled' | 'completed' | 'archived';

  @IsString()
  @MaxLength(500)
  reason!: string;
}

export class ChangeTeamStatusDto {
  @IsIn(['active', 'suspended', 'archived'])
  status!: 'active' | 'suspended' | 'archived';

  @IsString()
  @MaxLength(500)
  reason!: string;
}

export class ChangeTeamMatchStatusDto {
  @IsIn(['recruiting', 'matched', 'cancelled', 'completed', 'archived'])
  status!: 'recruiting' | 'matched' | 'cancelled' | 'completed' | 'archived';

  @IsString()
  @MaxLength(500)
  reason!: string;
}

export class AdminLogsQueryDto {
  @IsOptional()
  @IsUUID()
  adminUserId?: string;

  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsString()
  actionType?: string;

  @IsOptional()
  @IsUUID()
  actorUserId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

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
