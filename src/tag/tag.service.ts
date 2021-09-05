import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
    findAllTags(): string[] {
        return ["new test4"];
    }
}
