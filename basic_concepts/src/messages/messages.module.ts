import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { RegexFactory } from 'src/common/regex/regex.factory';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './messages.constants';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesService,
    RegexFactory,
    {
      provide: REMOVE_SPACES_REGEX,
      useFactory: (regexFactory: RegexFactory) => {
        return regexFactory.create('RemoveSpacesRegex');
      },
      inject: [RegexFactory],
    },
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useFactory: async (regexFactory: RegexFactory) => {
        console.log('Will wait promise resolve');
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('Promise was resolved');
        return regexFactory.create('OnlyLowercaseLettersRegex');
      },
      inject: [RegexFactory],
    },
  ],
  imports: [TypeOrmModule.forFeature([Message]), UsersModule],
})
export class MessagesModule {}
