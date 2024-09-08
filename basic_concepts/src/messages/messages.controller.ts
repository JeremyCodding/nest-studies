import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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

  @Post()
  create(@Body() body: { message: string; user: string }) {
    return `This route creates a message for ${body.user}:
    ${body.message}
    `;
  }
}
