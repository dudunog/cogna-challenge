import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TaskService } from 'src/modules/task/task.service';

@Injectable()
export class FindTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(id: string, userId: string) {
    const task = await this.taskService.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this task',
      );
    }

    return task;
  }
}
