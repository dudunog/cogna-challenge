import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskService } from 'src/modules/task/task.service';
import { UpdateTaskDto } from 'src/modules/task/dto/update-task.dto';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.taskService.update({
      where: { id },
      data: updateTaskDto,
    });
  }
}
