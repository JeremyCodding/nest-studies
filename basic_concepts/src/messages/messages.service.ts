import {
  ForbiddenException,
  //   HttpException,
  //   HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(pagination?: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    const messages = await this.messageRepository.find({
      take: limit,
      skip: offset,
      relations: ['from', 'to'],
      order: {
        id: 'desc',
      },
      select: {
        from: {
          id: true,
          nome: true,
        },
        to: {
          id: true,
          nome: true,
        },
      },
    });
    return messages;
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
      relations: ['from', 'to'],
      order: {
        id: 'desc',
      },
      select: {
        from: {
          id: true,
          nome: true,
        },
        to: {
          id: true,
          nome: true,
        },
      },
    });

    if (message) return message;

    // throw new HttpException('Message Not Found', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Message Not Found');
  }

  async create(body: CreateMessageDto, tokenPayload: TokenPayloadDto) {
    const { toId } = body;

    const to = await this.usersService.findOne(toId);

    const from = await this.usersService.findOne(tokenPayload.sub);
    console.log(from);
    const newMessage = {
      text: body.text,
      from,
      to,
      read: false,
      date: new Date(),
    };

    const message = await this.messageRepository.create(newMessage);

    await this.messageRepository.save(message);

    return {
      ...message,
      from: {
        id: message.from.id,
        name: message.from.nome,
      },
      to: {
        id: message.to.id,
        name: message.to.nome,
      },
    };
  }

  async update(
    id: number,
    body: UpdateMessageDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const message = await this.findOne(id);

    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException(
        "You can't update a message you didn't send",
      );
    }

    message.text = body?.text ?? message.text;
    message.read = body?.read ?? message.read;

    const updatedMessage = await this.messageRepository.save(message);

    return updatedMessage;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const message = await this.findOne(id);
    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException(
        "You can't delete a message you didn't send",
      );
    }

    if (message) return this.messageRepository.remove(message);

    throw new NotFoundException('Message Not Found');
  }
}
