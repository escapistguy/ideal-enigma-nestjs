import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {


    constructor(private readonly userService: UserService) {};

    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Get()
    @UseGuards(AuthGuard)
    async getCurrentUser(@User() user: UserEntity): Promise<UserResponseInterface>{
        return this.userService.buildUserResponse(user);
    }

    @Post('/login')
    @UsePipes(new ValidationPipe())
    async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.loginUser(loginUserDto);
        return this.userService.buildUserResponse(user);
    }
        
}
