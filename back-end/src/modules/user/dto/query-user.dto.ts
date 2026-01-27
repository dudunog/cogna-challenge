import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Skip must be an integer' })
  @Min(0, { message: 'Skip must be greater than or equal to 0' })
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Take must be an integer' })
  @Min(1, { message: 'Take must be greater than or equal to 1' })
  @Max(100, { message: 'Take must be less than or equal to 100' })
  take?: number;

  @IsOptional()
  @Type(() => String)
  email?: string;

  @IsOptional()
  @Type(() => String)
  orderBy?: 'asc' | 'desc';
}
