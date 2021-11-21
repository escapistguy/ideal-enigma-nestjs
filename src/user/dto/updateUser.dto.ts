import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    username: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    bio: string;

    @IsOptional()
    image: string;

    @IsOptional()
    password: string;
}