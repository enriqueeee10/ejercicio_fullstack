import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]; // Array de nombres de tags
}
