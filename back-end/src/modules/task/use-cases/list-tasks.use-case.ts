import { Injectable } from '@nestjs/common';
import { TaskService } from 'src/modules/task/task.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ListTasksUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(
    userId: string,
    params?: {
      skip?: number;
      take?: number;
      cursor?: Prisma.TaskWhereUniqueInput;
      where?: Prisma.TaskWhereInput;
      orderBy?: Prisma.TaskOrderByWithRelationInput;
      include?: Prisma.TaskInclude;
    },
  ) {
    const where: Prisma.TaskWhereInput = {
      userId,
      ...params?.where,
    };

    return this.taskService.findMany({
      ...params,
      where,
    });
  }
}
