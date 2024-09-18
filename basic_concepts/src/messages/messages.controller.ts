import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RegexProtocol } from 'src/common/regex/regex.protocol';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from './messages.constants';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(SERVER_NAME)
    private readonly serverName: string,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RegexProtocol,
    @Inject(ONLY_LOWERCASE_LETTERS_REGEX)
    private readonly onlyLowercaseLettersRegex: RegexProtocol,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    console.log(this.removeSpacesRegex.execute(this.serverName));
    console.log(this.onlyLowercaseLettersRegex.execute(this.serverName));

    const messages = await this.messagesService.findAll(pagination);

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
