import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateCategoryDto extends CreateCategoryDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
