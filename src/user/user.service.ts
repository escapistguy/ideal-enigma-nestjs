import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from '@app/types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { hash, compare as compareHash } from 'bcrypt';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
    ) {};

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({email: createUserDto.email});
        const userByUsername = await this.userRepository.findOne({username: createUserDto.username});
        
        if(userByEmail || userByUsername){
            throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        return await this.userRepository.save(newUser);
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const loginUser = await this.userRepository.findOne({
            email: loginUserDto.email
        }, {select: ['id', 'username', 'email', 'bio', 'image', 'password']});

        if(!loginUser){
            throw new HttpException('Invalid credentials', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const isLoginAuth = await compareHash(loginUserDto.password, loginUser.password);

        if(!isLoginAuth){
            throw new HttpException('Invalid credentials', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        delete loginUser.password;
        
        return loginUser;
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }
    
    generateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, JWT_SECRET);
    }
}
