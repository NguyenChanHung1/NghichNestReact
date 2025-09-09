import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { User } from './schemas/users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/create')
    createUser(@Body() createUserDto: UserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Get()  
    getAllUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get('/:id')
    getUserById(@Param('id') id: string): User|null {
        return this.getUserById(id);
    }

    @Delete('/delete/:id')
    deleteUsers(@Param('id') id: string): void {
        this.usersService.delete(id);
    }
} 
