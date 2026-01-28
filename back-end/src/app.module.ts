import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [DatabaseModule, UserModule, TaskModule],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
