import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('Timing connection interceptor executed BEFORE');
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return next.handle().pipe(
      tap(() => {
        const finalTime = Date.now();
        const elapsed = finalTime - startTime;
        console.log(
          `TimingConnectionInterceptor: took ${elapsed} miliseconds to execute`,
        );
      }),
    );
  }
}
