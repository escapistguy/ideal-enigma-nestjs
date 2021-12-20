import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) 
        private readonly articleRepository: Repository<ArticleEntity>
    ) {};

    async createArticle(user: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        const article = new ArticleEntity();
        Object.assign(article, createArticleDto);

        if(!Array.isArray(article.tagList)){
            article.tagList = [];
        }

        article.author = user;
        
        article.slug = ArticleService.generateSlug(article.title);
        
        return await this.articleRepository.save(article);
    }

    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface{
        const author = article.author;
        return {
            slug: article.slug,
            title: article.title,
            description: article.description,
            body: article.body,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            tagList: article.tagList,
            author: {
                username: author.username,
                bio: author.bio,
                image: author.image
            }
        }
    }

    async getArticleBySlug(slug: string): Promise<ArticleEntity> {
        const article = await this.articleRepository.findOne({slug});

        if(!article) {
            throw new HttpException("Article not found", HttpStatus.NOT_FOUND);
        }

        return article;
    }

    async deleteArticle(userId: number, slug: string): Promise<DeleteResult> {
        const article = await this.getArticleBySlug(slug);

        const isUserAuthor = article.author && article.author.id === userId;
        if(!isUserAuthor ) {
            throw new HttpException("User is not author", HttpStatus.FORBIDDEN);
        }

        return this.articleRepository.delete({id: article.id});
    }

    private static generateSlug(title: string): string {
        return `${slugify(title, { lower: true})}-${(Math.random() * 36 ** 6 | 0).toString(36)}`;
    }
}
