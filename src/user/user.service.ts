import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { hash, compare as compareHash } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ValidationErrorResponse } from '@app/pipes/mediumValidation.pipe';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
    ) {};

    async getUser(id: number): Promise<UserEntity> {
        return this.userRepository.findOne(id);
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        
        const errorResponse: ValidationErrorResponse = {errors: {}};

        const userByEmail = await this.userRepository.findOne({email: createUserDto.email});
        if(userByEmail) {
            errorResponse.errors["email"] = [
                "Email is taken"
            ];
        }

        const userByUsername = await this.userRepository.findOne({username: createUserDto.username});
        if(userByUsername){
            errorResponse.errors["usename"] = [
                "Username is taken"
            ];
        }

        if(Object.keys(errorResponse.errors).length > 0){
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        return await this.userRepository.save(newUser);
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.getUser(userId);

        if(!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        Object.assign(user, updateUserDto);

        const errorResponse: ValidationErrorResponse = {errors: {}};
        const userByEmail = await this.userRepository.findOne({email: updateUserDto.email});
        if(userByEmail) {
            errorResponse.errors["email"] = [
                "Email is taken"
            ];
        }

        const userByUsername = await this.userRepository.findOne({username: updateUserDto.username});
        if(userByUsername){
            errorResponse.errors["usename"] = [
                "Username is taken"
            ];
        }

        if(Object.keys(errorResponse.errors).length > 0){
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        return await this.userRepository.save(user);
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const loginUser = await this.userRepository.findOne({
            email: loginUserDto.email
        }, {select: ['id', 'username', 'email', 'bio', 'image', 'password']});

        if(!loginUser){
            throw new HttpException({errors: {"email or password": ["is invalid"]}}, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const isLoginAuth = await compareHash(loginUserDto.password, loginUser.password);

        if(!isLoginAuth){
            throw new HttpException({errors: {"email or password": ["is invalid"]}}, HttpStatus.UNPROCESSABLE_ENTITY);
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
