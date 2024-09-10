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

  private lastId = 1;
  private messages: Message[] = [
    {
      id: 1,
      text: 'Test message',
      from: 'Joana',
      to: 'Jeremy',
      read: false,
      date: new Date(),
    },
  ];

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

  create(body: CreateMessageDto) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...body,
      read: false,
      date: new Date(),
    };

    this.messages.push(newMessage);

    return newMessage;
  }

  update(id: string, body: UpdateMessageDto) {
    const messageFound = this.messages.findIndex(
      (message) => message.id === +id,
    );

    if (messageFound < 0) {
      throw new NotFoundException(
        `We couldn't find a message with the ID: ${id}`,
      );
    }

    if (messageFound >= 0) {
      const messageToUpdate = this.messages[messageFound];

      return (this.messages[messageFound] = {
        ...messageToUpdate,
        ...body,
      });
    }

    return `It wasn't possible to find a message with ID: ${id}`;
  }

  remove(id: number) {
    const messageFound = this.messages.findIndex(
      (message) => message.id === id,
    );

    if (messageFound < 0) {
      throw new NotFoundException(
        `We couldn't find a message with the ID: ${id}`,
      );
    }

    if (messageFound >= 0) {
      this.messages.splice(messageFound, 1);
      return `Message with ID ${id} deleted`;
    }

    return `We couldn't find a message with ID: ${id}`;
  }
}
