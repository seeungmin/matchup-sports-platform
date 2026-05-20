import { IsString, Matches, MaxLength } from 'class-validator';

export class DevLoginDto {
  @IsString()
  @MaxLength(190)
  @Matches(/^[^@\s]+@[^@\s]+$/)
  email!: string;
}
