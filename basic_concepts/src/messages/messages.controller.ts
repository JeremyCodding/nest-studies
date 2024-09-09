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

@Controller('messages')
export class MessagesController {
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: { limit: string; offset: string }) {
    const { limit = 10, offset = 0 } = pagination;
    return `Returns all messages. Limit: ${limit}, Offset: ${offset}`;
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { message?: string; user?: string },
  ) {
    return {
      id,
      ...body,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Deleted message with ID: ${id}`;
  }
}
