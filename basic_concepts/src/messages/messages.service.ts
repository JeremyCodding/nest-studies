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

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findAll() {
    const messages = await this.messageRepository.find();
    return messages;
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
    });

    if (message) return message;

    // throw new HttpException('Message Not Found', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Message Not Found');
  }

  async create(body: CreateMessageDto) {
    const newMessage = {
      ...body,
      read: false,
      date: new Date(),
    };

    const message = await this.messageRepository.create(newMessage);

    return this.messageRepository.save(message);
  }

  async update(id: number, body: UpdateMessageDto) {
    const partialUpdatedMessage = {
      read: body?.read,
      text: body?.text,
    };
    const message = await this.messageRepository.preload({
      id,
      ...partialUpdatedMessage,
    });

    if (message) {
      const updatedMessage = await this.messageRepository.save(message);

      return updatedMessage;
    }

    throw new NotFoundException('Message Not Found');
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (message) return this.messageRepository.remove(message);

    throw new NotFoundException('Message Not Found');
  }
}
