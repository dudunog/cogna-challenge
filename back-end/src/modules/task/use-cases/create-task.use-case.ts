import { Injectable } from '@nestjs/common';
import { TaskService } from 'src/modules/task/task.service';
import { CreateTaskDto } from 'src/modules/task/dto/create-task.dto';
import { TaskStatus } from 'src/common/types/enums/task-status.enum';

const DEFAULT_TASK_STATUS = TaskStatus.PENDING;

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(createTaskDto: CreateTaskDto, userId: string) {
    const { title, description, status } = createTaskDto;

    const newTask = await this.taskService.create({
      data: {
        title,
        description,
        status: status || DEFAULT_TASK_STATUS,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return newTask;
  }
}
