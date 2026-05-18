import { IsBoolean, IsIn, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsString()
  @MaxLength(40)
  displayName!: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string | null;

  @IsIn(['public', 'members_only', 'private'])
  visibilityStatus!: 'public' | 'members_only' | 'private';
}

class SettingsNotificationsDto {
  @IsOptional()
  @IsBoolean()
  matchEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  teamEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  teamMatchEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  chatEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  noticeEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEnabled?: boolean;
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsIn(['public', 'members_only', 'private'])
  visibilityStatus?: 'public' | 'members_only' | 'private';

  @IsOptional()
  @ValidateNested()
  @Type(() => SettingsNotificationsDto)
  notifications?: SettingsNotificationsDto;
}

export class WithdrawalRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string | null;
}
