import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { MatchGender, SportType, TeamMatchStatus } from '@prisma/client';

export class TeamMatchQueryDto {
  @ApiProperty({ required: false, enum: SportType, enumName: 'SportType' }) @IsOptional() @IsEnum(SportType) sportType?: SportType;
  @ApiProperty({ required: false, enum: MatchGender, enumName: 'MatchGender' }) @IsOptional() @IsEnum(MatchGender) gender?: MatchGender;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false, description: 'Single status or comma-separated status list', enum: TeamMatchStatus, enumName: 'TeamMatchStatus' })
  @IsOptional()
  @IsString()
  status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() teamId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() cursor?: string;
  @ApiProperty({ required: false, default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}
