import { Controller, Get, Param } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
  @Get()
  findAll() {
    return 'Returns all messages';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return `Return a specific message ID ${id}`;
  }
}
