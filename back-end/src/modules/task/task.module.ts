import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { FindTaskUseCase } from './use-cases/find-task.use-case';
import { ListTasksUseCase } from './use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from './use-cases/update-task.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    TaskService,
    CreateTaskUseCase,
    FindTaskUseCase,
    ListTasksUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
  ],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
