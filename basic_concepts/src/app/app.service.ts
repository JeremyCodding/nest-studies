import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  solveExample() {
    return 'Route Example in Service';
  }
}
