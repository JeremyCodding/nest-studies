import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

export class ErrorHandlingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('ErrorHandlingInterceptor interceptor executed BEFORE');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    return next.handle().pipe(
      catchError((error) => {
        console.log(error.name);
        console.log(error.message);
        return throwError(() => {
          if (error.name === 'NotFoundException') {
            return new BadRequestException(error.message);
          }
          return new BadRequestException('Something unexpected happend');
        });
      }),
    );
  }
}
