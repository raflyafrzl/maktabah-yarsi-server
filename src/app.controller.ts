import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('base')
export class AppController {
  @Get()
  getHello(): any {
    return {
      message: 'Welcome to Maktabah Yarsi API',
      version: 2.0,
    };
  }
}
