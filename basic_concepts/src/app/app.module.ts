import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from 'src/messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from './app.config';
import { AuthModule } from 'src/auth/auth.module';

// {
//   load: [appConfig],
//   validationSchema: Joi.object({
//     DATABASE_TYPE: Joi.required(),
//     DATABASE_HOST: Joi.required(),
//     DATABASE_PORT: Joi.number().default(5433),
//     DATABASE_USERNAME: Joi.required(),
//     DATABASE_DATABASE: Joi.required(),
//     DATABASE_PASSWORD: Joi.required(),
//     DATABASE_AUTOLOADENTITIES: Joi.number().min(0).max(1).default(0),
//     DATABASE_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
//   }),
// }

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: async (appConfigurations: ConfigType<typeof appConfig>) => {
        return {
          type: appConfigurations.database.type,
          host: appConfigurations.database.host,
          port: appConfigurations.database.port,
          username: appConfigurations.database.username,
          database: appConfigurations.database.database,
          password: appConfigurations.database.password,
          autoLoadEntities: appConfigurations.database.autoLoadEntities,
          synchronize: appConfigurations.database.synchronize,
        };
      },
    }),
    MessagesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
