import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Connection, Model } from 'mongoose';
import { UserDto } from './dto/users.dto';

@Injectable()
export class UsersService { 
    constructor(@InjectModel(User.name) private UserModel: Model<User>) { }

    async create (createUserDto: UserDto) : Promise<User> {
        const createdUser = new this.UserModel(createUserDto);
        return createdUser.save();
    }

    async findAll() : Promise<User[]> { 
        return this.UserModel.find().exec();
    }

    async findUserById(id: string) : Promise<User|null> {
        return this.UserModel.findById(id).exec();
    }

    async delete (id: string) {
        return this.UserModel.deleteOne({_id: id}).exec();
    }

}
