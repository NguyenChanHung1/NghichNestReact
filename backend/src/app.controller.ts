import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './users/schemas/users.schema';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  async getUsers() : Promise<string> {
    const userList : Array<User> = await this.usersService.findAll();
    console.log(userList[0].toString());
    return userList[0].toString() + "haha";
  }
}
