import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/modules/database/database.module';
import { SignUpUserUseCase } from './use-cases/sign-up-user.use-case';
import { FindUserUseCase } from './use-cases/find-user.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserService,
    SignUpUserUseCase,
    FindUserUseCase,
    UpdateUserUseCase,
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
