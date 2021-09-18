import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {


    constructor(private readonly userService: UserService) {};

    @Post()
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserEntity>{
        return this.userService.createUser(createUserDto);
    }
}
