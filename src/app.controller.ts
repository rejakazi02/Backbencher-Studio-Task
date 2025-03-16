import {Controller, Get, Query, Version, VERSION_NEUTRAL} from '@nestjs/common';
import { AppService } from './app.service';
import {ResponsePayload} from './interfaces/response-payload.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}



  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
