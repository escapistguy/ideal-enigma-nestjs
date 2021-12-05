import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {
    /**
     * {
            "article": {
                "title": "string",
                "description": "string",
                "body": "string",
                "tagList": [
                "string"`
                ]
            }
        }   
     */
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly body: string;

    readonly tagList?: string[];
}