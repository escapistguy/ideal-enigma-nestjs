import { ArticleResponseInterface } from "./articleResponse.interface";

export interface ArticlesResponseInterface {
    articles: ArticleResponseInterface[],
    articlesCount: number
}