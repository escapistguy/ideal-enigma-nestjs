import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { PATH_PARAMS } from './article.constants';
import { DeleteResult } from 'typeorm';

@Controller('articles')
export class ArticleController {
    
    constructor(private readonly articleService: ArticleService){}

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async createArticle(@Body('article') createArticleDto: CreateArticleDto, @User() user: UserEntity): Promise<ArticleResponseInterface> {
        const article = await this.articleService.createArticle(user, createArticleDto);
        return this.articleService.buildArticleResponse(article);
    }

    @Get(`/:${PATH_PARAMS.SLUG}`)
    @UsePipes(new ValidationPipe())
    async getSingleArticle(@Param(PATH_PARAMS.SLUG) slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.getArticleBySlug(slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(`/:${PATH_PARAMS.SLUG}`)
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async deleteSingleArticle(@User('id') userId: number, @Param(PATH_PARAMS.SLUG) slug: string): Promise<HttpStatus> {
        const deleteResult = await this.articleService.deleteArticle(userId, slug);

        if(!deleteResult.affected) {
            throw new HttpException("Article could not be deleted", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return HttpStatus.OK;
    }
}
