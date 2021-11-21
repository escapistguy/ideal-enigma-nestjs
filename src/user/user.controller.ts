import { AppRequest } from '@app/types/appRequest.interface';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
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
    async getCurrentUser(@Req() request: AppRequest): Promise<UserResponseInterface>{
        if(!request.user) {
            throw new HttpException("Invalid authorization token", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        return this.userService.buildUserResponse(request.user);
    }

    @Post('/login')
    @UsePipes(new ValidationPipe())
    async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.loginUser(loginUserDto);
        return this.userService.buildUserResponse(user);
    }
        
}
