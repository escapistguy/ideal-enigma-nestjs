import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { GetArticlesDto } from './dto/getArticles.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) 
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
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

    async getArticles(userId: number, query: GetArticlesDto) : Promise<ArticlesResponseInterface>{ 
        let queryBuilder = this.articleRepository
            .createQueryBuilder("articles")
            .leftJoinAndSelect("articles.author", "author");

        if(query.tag) {
            queryBuilder.andWhere("articles.tagList like :tag", {tag: `%${query.tag}%`});
        }
        
        if(query.author) {
            queryBuilder.andWhere('author.username = :author', {author: query.author});
        }

        if (query.favorited) {
            const author = await this.userRepository.findOne(
                {
                username: query.favorited,
                },
                { relations: ['favoriteArticles'] },
            );
            const ids = author? author.favoriteArticles.map(article => article.id) : [];
            console.log(ids);
            if (ids.length > 0) {
                queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
            } else {
                return {
                    articles: [],
                    articlesCount: 0
                }
            }
        }

        queryBuilder.orderBy("articles.createdAt", "DESC");

        let articlesCount = await queryBuilder.getCount();    

        if(query.limit) {
            queryBuilder.limit(query.limit);
        }

        if(query.offset) {
            queryBuilder.offset(query.offset);
        }
        
        let favoriteIds: number[] = [];
        if (userId) {
            const currentUser = await this.userRepository.findOne(userId, {
                relations: ['favoriteArticles'],
            });
            favoriteIds = currentUser.favoriteArticles.map((favorite) => favorite.id);
        }

        const articles = (await queryBuilder.getMany())
            .map((article) => ({
                ...article, 
                favorited: favoriteIds.includes(article.id)
            }));
        return {
            articles,
            articlesCount
        };
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

    async updateArticle(userId: number, slug: string, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity> {
        const article = await this.getArticleBySlug(slug);

        const isUserAuthor = article.author && article.author.id === userId;
        if(!isUserAuthor ) {
            throw new HttpException("User is not author", HttpStatus.FORBIDDEN);
        }

        Object.assign(article, updateArticleDto);

        if(updateArticleDto.title) {
            article.slug = ArticleService.generateSlug(updateArticleDto.title);
        }

        return this.articleRepository.save(article);
    }

    async addArticleToFavorites(userId: number, slug: string): Promise<ArticleEntity> {
        const article = await this.getArticleBySlug(slug);

        const user = await this.userRepository.findOne(userId, {
            relations: ['favoriteArticles']
        });
        
        if(!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        if(!user.favoriteArticles.find(currentArticle => currentArticle.id === article.id)){
            user.favoriteArticles.push(article);
            article.favoritesCount++;
            await this.userRepository.save(user);
        }

        return article;
    }

    async removeArticleToFavorites(userId: number, slug: string): Promise<ArticleEntity> {
        const article = await this.getArticleBySlug(slug);

        const user = await this.userRepository.findOne(userId, {
            relations: ['favoriteArticles']
        });
        
        if(!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        const articleIndex = user.favoriteArticles.findIndex(currentArticle => currentArticle.id === article.id);
        if(articleIndex != -1){
            user.favoriteArticles.splice(articleIndex, 1);
            article.favoritesCount--;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }

    private static generateSlug(title: string): string {
        return `${slugify(title, { lower: true})}-${(Math.random() * 36 ** 6 | 0).toString(36)}`;
    }
}
