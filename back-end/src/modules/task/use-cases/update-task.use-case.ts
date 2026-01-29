import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TaskService } from 'src/modules/task/task.service';
import { UpdateTaskDto } from 'src/modules/task/dto/update-task.dto';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.taskService.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta tarefa',
      );
    }

    return this.taskService.update({
      where: { id },
      data: updateTaskDto,
    });
  }
}
