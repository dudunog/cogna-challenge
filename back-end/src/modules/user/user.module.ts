import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { FindUserUseCase } from './use-cases/find-user.use-case';
import { FindUsersUseCase } from './use-cases/find-users.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserService,
    CreateUserUseCase,
    FindUserUseCase,
    FindUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
