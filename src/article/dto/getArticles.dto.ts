import { IsNotEmpty, IsNumber } from "class-validator";

export class GetArticlesDto {
    readonly favorited?: string;

    readonly author?: string;

    readonly tag?: string;

    readonly limit: number = 20;

    readonly offset: number = 0;
}