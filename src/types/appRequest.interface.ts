import { UserEntity } from "@app/user/user.entity";
import { Request } from "express";

export interface AppRequest extends Request {
    user?: UserEntity
}