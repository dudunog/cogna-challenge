import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { DatabaseModule } from 'src/modules/database/database.module';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './use-cases/login.use-case';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [LoginUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
