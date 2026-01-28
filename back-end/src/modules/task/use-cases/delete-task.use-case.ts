import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskService } from 'src/modules/task/task.service';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(id: string) {
    const task = await this.taskService.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.taskService.delete({
      where: { id },
    });
  }
}
