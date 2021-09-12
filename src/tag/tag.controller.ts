import { Controller, Get } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { TagEntity } from './tag.entity';

@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get()
    async findAll(): Promise<{tags: String[]}> {
        return await this.tagService.findAllTags();
    }
}
