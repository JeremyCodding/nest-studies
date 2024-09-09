import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: { limit: string; offset: string }) {
    const { limit = 10, offset = 0 } = pagination;
    console.log(limit, offset);
    // return `Returns all messages. Limit: ${limit}, Offset: ${offset}`;
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.messagesService.findOne(id);
  }

  @Post()
  create(@Body() body: Message) {
    return this.messagesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<Message>) {
    return this.messagesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
