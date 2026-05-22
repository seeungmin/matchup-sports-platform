import { Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class RecentSearchesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}

export class RecordSearchDto {
  @IsString()
  @MaxLength(50)
  query!: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, unknown>;
}
