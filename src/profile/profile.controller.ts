import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {};

    @Get('/:username')
    async getProfile(@User('id') currentUserId: number, @Param('username') username: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileService.getProfile(username, currentUserId);

        return profile;
    }

    @Post('/:username/follow')
    @UseGuards(AuthGuard)
    async followProfile(@User('id') currentUserId: number, @Param('username') username: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileService.followProfile(currentUserId, username);

        return profile;
    }

    @Delete('/:username/follow')
    @UseGuards(AuthGuard)
    async unfollowProfile(@User('id') currentUserId: number, @Param('username') username: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileService.unfollowProfile(currentUserId, username);

        return profile;
    }

}
