import { IsNotEmpty, IsNumber } from "class-validator";

export class GetArticlesDto {
    readonly favorited?: boolean;

    readonly author?: number;

    readonly tag?: string;

    readonly limit: number = 20;

    readonly offset: number = 0;
}