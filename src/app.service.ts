import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {ResponsePayload} from './interfaces/response-payload.interface';

@Injectable()
export class AppService {
  constructor(

  ) {

  }


  getHello(): string {
    return `
    <h1>Welcome to QA API Server</h1>
     <h4>Version 1.0.0</h4>
    <hr>
    <h4>Powered By Reja></h4>
    `;
  }
}
