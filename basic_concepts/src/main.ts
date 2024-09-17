import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove keys that are not in the DTO
      forbidNonWhitelisted: true, // Throws an error if there are non existant keys
      transform: false, // Transforms params in the DTO types
    }),
    new ParseIntIdPipe(),
  );

  await app.listen(3000);
}
bootstrap();
