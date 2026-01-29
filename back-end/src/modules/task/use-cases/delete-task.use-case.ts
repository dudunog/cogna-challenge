import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TaskService } from 'src/modules/task/task.service';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(id: string, userId: string) {
    const task = await this.taskService.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir esta tarefa',
      );
    }

    return this.taskService.delete({
      where: { id },
    });
  }
}
