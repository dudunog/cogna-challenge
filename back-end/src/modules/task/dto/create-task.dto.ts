import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/common/types/enums/task-status.enum';

export class CreateTaskDto {
  @IsString({ message: 'Título deve ser uma string' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description: string;

  @IsEnum(TaskStatus, {
    message: 'Status deve ser pendente, em progresso ou concluído',
  })
  @IsOptional()
  status?: TaskStatus;
}
