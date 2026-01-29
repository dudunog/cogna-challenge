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
import { TaskStatus } from 'src/common/types/enums/task-status.enum';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
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
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.createTaskUseCase.execute(createTaskDto, user.id);
  }

  @Get()
  async findAll(
    @CurrentUser() user: { id: string; email: string },
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('orderBy') orderBy?: string,
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
  ) {
    const params: {
      skip?: number;
      take?: number;
      where?: { status?: TaskStatus };
      orderBy?: { [key: string]: 'asc' | 'desc' };
    } = {};

    if (skip) {
      params.skip = parseInt(skip, 10);
    }

    if (take) {
      params.take = parseInt(take, 10);
    }

    if (status) {
      params.where = { status: status as TaskStatus };
    }

    if (orderBy && orderDirection) {
      params.orderBy = {
        [orderBy]: orderDirection,
      };
    }

    return this.listTasksUseCase.execute(user.id, params);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.findTaskUseCase.execute(id, user.id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.updateTaskUseCase.execute(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.deleteTaskUseCase.execute(id, user.id);
  }
}
