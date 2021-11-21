import { AppRequest } from "@app/types/appRequest.interface";
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean{
        const request = ctx.switchToHttp().getRequest<AppRequest>();

        if(request.user){
            return true;
        }

        throw new HttpException("Unauthorized request", HttpStatus.UNAUTHORIZED);
    }
}