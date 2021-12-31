import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { PARAMS } from './article.constants';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { GetArticlesDto } from './dto/getArticles.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { GetArticlesFeedDto } from './dto/getArticlesFeed.dto';
import { MediumValidationPipe } from '@app/pipes/mediumValidation.pipe';

@Controller('articles')
export class ArticleController {
    
    constructor(private readonly articleService: ArticleService){}

    @Get()
    @UsePipes(new MediumValidationPipe({transform: true}))
    async getAllArticles(@User('id') userId: number, @Query() query: GetArticlesDto): Promise<ArticlesResponseInterface> {
        return await this.articleService.getArticles(userId, query);
    }

    @Get("/feed")
    @UsePipes(new MediumValidationPipe({transform: true}))
    @UseGuards(AuthGuard)
    async getFeed(@User('id') userId: number, @Query() query: GetArticlesFeedDto): Promise<ArticlesResponseInterface> {
        return await this.articleService.getFeed(userId, query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new MediumValidationPipe())
    async createArticle(@Body('article') createArticleDto: CreateArticleDto, @User() user: UserEntity): Promise<ArticleResponseInterface> {
        const article = await this.articleService.createArticle(user, createArticleDto);
        return this.articleService.buildArticleResponse(article);
    }

    @Get(`/:${PARAMS.SLUG}`)
    @UsePipes(new MediumValidationPipe())
    async getSingleArticle(@Param(PARAMS.SLUG) slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.getArticleBySlug(slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(`/:${PARAMS.SLUG}`)
    @UseGuards(AuthGuard)
    @UsePipes(new MediumValidationPipe())
    async deleteSingleArticle(@User('id') userId: number, @Param(PARAMS.SLUG) slug: string): Promise<HttpStatus> {
        const deleteResult = await this.articleService.deleteArticle(userId, slug);

        if(!deleteResult.affected) {
            throw new HttpException("Article was not deleted", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return HttpStatus.OK;
    }

    @Put(`/:${PARAMS.SLUG}`)
    @UseGuards(AuthGuard)
    @UsePipes(new MediumValidationPipe())
    async updateSingleArticle(@User('id') userId: number, @Param(PARAMS.SLUG) slug: string, @Body('article') updateArticleDto: UpdateArticleDto): Promise<ArticleResponseInterface> {
        const updatedArticle = await this.articleService.updateArticle(userId, slug, updateArticleDto);

        return this.articleService.buildArticleResponse(updatedArticle);
    }

    @Post(`/:${PARAMS.SLUG}/favorite`)
    @UseGuards(AuthGuard)
    async addArticleToFavorites(@User('id') userId: number, @Param(PARAMS.SLUG) slug: string): Promise<ArticleResponseInterface> {
        const favoritedArticle = await this.articleService.addArticleToFavorites(userId, slug);

        return this.articleService.buildArticleResponse(favoritedArticle);
    }

    @Delete(`/:${PARAMS.SLUG}/favorite`)
    @UseGuards(AuthGuard)
    async removeArticleToFavorites(@User('id') userId: number, @Param(PARAMS.SLUG) slug: string): Promise<ArticleResponseInterface> {
        const favoritedArticle = await this.articleService.removeArticleToFavorites(userId, slug);

        return this.articleService.buildArticleResponse(favoritedArticle);
    }
}
