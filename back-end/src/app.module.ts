import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
