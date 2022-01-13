export interface ArticleResponseInterface {
    /**
    {
        "article": {
            "slug": "string",
            "title": "string",
            "description": "string",
            "body": "string",
            "tagList": [
                "string"
            ],
            "createdAt": "2021-11-21T23:08:02.797Z",
            "updatedAt": "2021-11-21T23:08:02.797Z",
            "favorited": true,
            "favoritesCount": 0,
            "author": {
                "username": "string",
                "bio": "string",
                "image": "string",
                "following": true
            }
        }
    }
     */
    article: {
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
        },
        favorited? : boolean
    }
}