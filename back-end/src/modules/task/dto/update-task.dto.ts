import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from 'src/common/types/enums/task-status.enum';

export class UpdateTaskDto {
  @IsString({ message: 'Título deve ser uma string' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Descrição deve ser uma string' })
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus, {
    message: 'Status deve ser pendente, em progresso ou concluído',
  })
  @IsOptional()
  status?: TaskStatus;
}
