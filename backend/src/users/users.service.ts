import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './schemas/users.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/users.dto';

@Injectable()
export class UsersService { 
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) { }

    async create (createUserDto: UserDto) : Promise<User> {
        const createdUser = new this.UserModel(createUserDto);
        return createdUser.save();
    }

    async findAll() : Promise<User[]> {
        return this.UserModel.find().exec();
    }
}
