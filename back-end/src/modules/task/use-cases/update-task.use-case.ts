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
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this task',
      );
    }

    return this.taskService.update({
      where: { id },
      data: updateTaskDto,
    });
  }
}
