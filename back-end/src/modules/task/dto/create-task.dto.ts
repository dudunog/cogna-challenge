import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/common/types/enums/task-status.enum';

export class CreateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsEnum(TaskStatus, {
    message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED',
  })
  @IsOptional()
  status?: TaskStatus;
}
