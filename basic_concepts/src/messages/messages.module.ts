import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    TypeOrmModule.forFeature([Message]),
    UsersModule,
    MyDynamicModule.register({
      apiKey: 'API_KEY',
      apiUrl: 'http://apiUrl.com',
    }),
  ],
})
export class MessagesModule {}
