import { Prisma } from 'generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';

@Injectable()
export class TaskService {
  constructor(private prisma: DatabaseService) {}

  findUnique(params: {
    where: Prisma.TaskWhereUniqueInput;
    include?: Prisma.TaskInclude;
    select?: Prisma.TaskSelect;
  }) {
    const { where, include, select } = params;

    if (include) {
      return this.prisma.task.findUnique({
        where,
        include,
      });
    }

    return this.prisma.task.findUnique({
      where,
      select,
    });
  }

  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
    include?: Prisma.TaskInclude;
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.task.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  count(params: { where?: Prisma.TaskWhereInput }) {
    const { where } = params;
    return this.prisma.task.count({
      where,
    });
  }

  async create(params: {
    data: Prisma.TaskCreateInput;
    include?: Prisma.TaskInclude;
  }) {
    const { data, include } = params;
    const newTask = await this.prisma.task.create({
      data,
      include,
    });

    return newTask;
  }

  async update(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
    include?: Prisma.TaskInclude;
    select?: Prisma.TaskSelect;
  }) {
    const { where, data, include, select } = params;

    if (include) {
      return this.prisma.task.update({
        data,
        where,
        include,
      });
    }

    return this.prisma.task.update({
      data,
      where,
      select,
    });
  }

  async delete(params: { where: Prisma.TaskWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.task.delete({
      where,
    });
  }
}
