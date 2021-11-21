import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserEntity } from "../user.entity";

export const User = createParamDecorator((data: string, ctx: ExecutionContext) : UserEntity | number | string => {
    const request = ctx.switchToHttp().getRequest();
    
    if(!request.user){
        return null;
    }

    return data? request.user[data] || null : request.user;
});