import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import appConfig from './app.config';
import { ConfigType } from '@nestjs/config';

@Controller('home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {}

  // @Get('hello')
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // @Get('example')
  // testResource() {
  //   return this.appService.solveExample();
  // }
}
