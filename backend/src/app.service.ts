import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './users/schemas/users.schema';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Worldddddddddddd!';
  }
}
