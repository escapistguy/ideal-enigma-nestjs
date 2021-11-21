import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from 'express';
import { AppRequest } from "./types/appRequest.interface";
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from "./config";
import { UserService } from "./user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(private readonly userService: UserService){}

    async use(req: AppRequest, _: Response, next: NextFunction) {
        if(req.headers.authorization){
            try{
                const token = req.headers.authorization.split(" ")[1];
                const decodedToken = verify(token, JWT_SECRET);
                console.log(decodedToken.id);
                req.user = await this.userService.getUser(decodedToken.id);
            } catch(error) {
                console.warn(`Error trying to verify authorization token. authorization: ${req.headers.authorization}, error: ${error}`);
                req.user = null;
            }
        } else {
            req.user = null;
        }

        next();
    }
}