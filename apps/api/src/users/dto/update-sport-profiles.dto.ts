import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SportType } from '@prisma/client';

export class SportProfileInputDto {
  @ApiProperty({ enum: SportType, enumName: 'SportType' })
  @IsEnum(SportType)
  sportType!: SportType;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  level!: number;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @IsOptional()
  preferredPositions?: string[];
}

export class UpdateSportProfilesDto {
  @ApiProperty({ type: [SportProfileInputDto] })
  @IsArray()
  @ArrayMaxSize(8)
  @ArrayUnique((profile: SportProfileInputDto) => profile.sportType)
  @ValidateNested({ each: true })
  @Type(() => SportProfileInputDto)
  profiles!: SportProfileInputDto[];
}
