import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';


@Injectable()
export class TagService {

    constructor(
        @InjectRepository(TagEntity) 
        private readonly tagRepository: Repository<TagEntity>
    ) {}

    async findAllTags(): Promise<{tags: String[]}> {
        const tags:TagEntity[] = await this.tagRepository.find();

        return {
            tags: tags.map(tag => tag.name)
        }
    }
}
