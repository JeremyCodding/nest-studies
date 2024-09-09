import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
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

  findAll() {
    return this.messages;
  }

  findOne(id: string) {
    return this.messages.find((message) => message.id === +id);
  }

  create(body: any) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...body,
    };

    this.messages.push(newMessage);

    return newMessage;
  }

  update(id: string, body: Partial<Message>) {
    const messageFound = this.messages.findIndex(
      (message) => message.id === +id,
    );

    if (messageFound >= 0) {
      const messageToUpdate = this.messages[messageFound];

      return (this.messages[messageFound] = {
        ...messageToUpdate,
        ...body,
      });
    }

    return `It wasn't possible to find a message with ID: ${id}`;
  }

  remove(id: string) {
    const foundMessage = this.messages.findIndex(
      (message) => message.id === +id,
    );

    if (foundMessage >= 0) {
      this.messages.splice(foundMessage, 1);
      return `Message with ID ${id} deleted`;
    }

    return `We couldn't find a message with ID: ${id}`;
  }
}
