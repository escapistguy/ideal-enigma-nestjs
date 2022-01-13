import { ArticleResponseInterface } from "./articleResponse.interface";

interface ArticleResponse {
    slug: string
    title: string
    description: string
    body: string
    createdAt: Date
    updatedAt: Date
    favoritesCount? : number
    tagList: string[]
    author: {
        username: string
        bio: string
        image: string
        following?: boolean
    }
}
export interface ArticlesResponseInterface {
    articles: ArticleResponse[],
    articlesCount: number
}