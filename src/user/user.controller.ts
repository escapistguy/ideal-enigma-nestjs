import { MediumValidationPipe } from '@app/pipes/mediumValidation.pipe';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { Body, Controller, Get, Post, UsePipes, UseGuards, Put } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller(['users', 'user'])
export class UserController {


    constructor(private readonly userService: UserService) {};

    @Post()
    @UsePipes(new MediumValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Get()
    @UseGuards(AuthGuard)
    async getCurrentUser(@User() user: UserEntity): Promise<UserResponseInterface>{
        return this.userService.buildUserResponse(user);
    }

    @Put()
    @UseGuards(AuthGuard)
    @UsePipes(new MediumValidationPipe())
    async updateUser(@Body('user') updateUserDto: UpdateUserDto, @User('id') userId: number): Promise<UserResponseInterface>{
        const updatedUser = await this.userService.updateUser(userId, updateUserDto);
        return this.userService.buildUserResponse(updatedUser);
    }

    @Post('/login')
    @UsePipes(new MediumValidationPipe())
    async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.loginUser(loginUserDto);
        return this.userService.buildUserResponse(user);
    }
        
}
