import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class AddHeaderInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const response = context.switchToHttp().getResponse();

    response.setHeader('X-Custom-Header', 'Custom Header Value');

    return next.handle();
  }
}
