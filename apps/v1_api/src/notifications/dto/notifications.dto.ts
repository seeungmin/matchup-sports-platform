import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class NotificationsQueryDto {
  @IsOptional()
  @IsIn(['created', 'read', 'unread'])
  status?: 'created' | 'read' | 'unread';

  @IsOptional()
  @IsString()
  type?: string;

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

export class ReadAllNotificationsDto {
  @IsOptional()
  @IsString()
  type?: string | null;
}

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  importantEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  activityEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEnabled?: boolean;
}
