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
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './messages.constants';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RemoveSpacesRegex,
    @Inject(ONLY_LOWERCASE_LETTERS_REGEX)
    private readonly onlyLowercaseLetters: RemoveSpacesRegex,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const messages = await this.messagesService.findAll(pagination);
    console.log(this.removeSpacesRegex.execute('REMOVE THE SPACES'));
    console.log(this.onlyLowercaseLetters.execute('Remove The Spaces'));

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
