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
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';

@UseInterceptors(AuthTokenInterceptor)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() pagination?: PaginationDto) {
    // const { limit = 10, offset = 0 } = pagination;
    const messages = await this.messagesService.findAll(pagination);

    // return `Returns all messages. Limit: ${limit}, Offset: ${offset}`;
    return messages;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.messagesService.findOne(id);
  }

  @Post()
  create(@Body() createMessageDTO: CreateMessageDto) {
    return this.messagesService.create(createMessageDTO);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMessageDTO: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.messagesService.remove(id);
  }
}
