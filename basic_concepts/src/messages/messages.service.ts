import {
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

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    const messages = await this.messageRepository.find({
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

  async create(body: CreateMessageDto) {
    const { fromId, toId } = body;

    const from = await this.usersService.findOne(fromId);
    const to = await this.usersService.findOne(toId);

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
      },
      to: {
        id: message.to.id,
      },
    };
  }

  async update(id: number, body: UpdateMessageDto) {
    const message = await this.findOne(id);

    message.text = body?.text ?? message.text;
    message.read = body?.read ?? message.read;

    const updatedMessage = await this.messageRepository.save(message);

    return updatedMessage;
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (message) return this.messageRepository.remove(message);

    throw new NotFoundException('Message Not Found');
  }
}
