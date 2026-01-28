import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma, TaskStatus } from 'generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { FindTaskUseCase } from './use-cases/find-task.use-case';
import { ListTasksUseCase } from './use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly findTaskUseCase: FindTaskUseCase,
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.createTaskUseCase.execute(createTaskDto);
  }

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('orderBy') orderBy?: string,
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
  ) {
    return this.listTasksUseCase.execute(
      this.buildListParams({
        skip,
        take,
        userId,
        status,
        orderBy,
        orderDirection,
      }),
    );
  }

  private buildListParams(query: {
    skip?: string;
    take?: string;
    userId?: string;
    status?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }): {
    skip?: number;
    take?: number;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  } {
    const { skip, take, userId, status, orderBy, orderDirection } = query;

    if (!skip && !take && !userId && !status && !orderBy && !orderDirection) {
      return {};
    }

    const where: Prisma.TaskWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status as TaskStatus;
    }

    let orderByInput;

    if (orderBy && orderDirection) {
      orderByInput = {
        [orderBy]: orderDirection,
      };
    }

    return {
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where: Object.keys(where).length ? where : undefined,
      orderBy: orderByInput,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.findTaskUseCase.execute(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.updateTaskUseCase.execute(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteTaskUseCase.execute(id);
  }
}
