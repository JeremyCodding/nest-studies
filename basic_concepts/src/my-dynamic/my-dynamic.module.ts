import { DynamicModule, Module } from '@nestjs/common';

export type MyDynamicModuleConfig = {
  apiKey: string;
  apiUrl: string;
};

export const MY_DYNAMIC_CONFIG = 'MY_DYNAMIC_CONFIG';

@Module({})
export class MyDynamicModule {
  static register(configs: MyDynamicModuleConfig): DynamicModule {
    console.log('The module configs are:');
    console.log(configs);
    return {
      module: MyDynamicModule,
      imports: [],
      providers: [
        {
          provide: MY_DYNAMIC_CONFIG,
          useValue: configs,
        },
      ],
      controllers: [],
      exports: [],
    };
  }
}
