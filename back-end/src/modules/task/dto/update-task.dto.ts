import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from 'generated/prisma/client';

export class UpdateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus, {
    message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED',
  })
  @IsOptional()
  status?: TaskStatus;
}
