import { ValidationErrorResponse } from '@app/pipes/mediumValidation.pipe';
import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.entity';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Injectable()
export class ProfileService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private readonly followEntity: Repository<FollowEntity>
    ) {}

    async getProfile(username: string, currentUserId: number): Promise<ProfileResponseInterface> {
        const user = await this.userRepository.findOne({username});

        if(!user) {
            throw new HttpException("Profile not found", HttpStatus.NOT_FOUND);
        }

        const isFollowing = Boolean(await this.followEntity.findOne({
            followerId: currentUserId,
            followingId: user.id
        }));
        
        return this.buildProfileResponse(user, isFollowing);
    }

    async followProfile(currentUserId: number, followingUsername: string): Promise<ProfileResponseInterface> {
        const user = await this.userRepository.findOne({username: followingUsername});

        if(!user) {
            throw new HttpException("Profile not found", HttpStatus.NOT_FOUND);
        }

        if(user.id === currentUserId) {
            const errorResponse: ValidationErrorResponse = {
                errors: {
                    username: ["Follower and following users can't be equal"]
                }
            };
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        let follow = await this.followEntity.findOne({
            followerId: currentUserId,
            followingId: user.id
        });      
        
        if(!follow) {
            follow = new FollowEntity();
            follow.followerId = currentUserId;
            follow.followingId = user.id;

            await this.followEntity.save(follow);
        }

        return this.buildProfileResponse(user, true);
    }

    async unfollowProfile(currentUserId: number, followingUsername: string): Promise<ProfileResponseInterface> {
        const user = await this.userRepository.findOne({username: followingUsername});

        if(!user) {
            throw new HttpException("Profile not found", HttpStatus.NOT_FOUND);
        }

        if(user.id === currentUserId) {
            const errorResponse: ValidationErrorResponse = {
                errors: {
                    username: ["Follower and following users can't be equal"]
                }
            };
            throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        await this.followEntity.delete({
            followerId: currentUserId,
            followingId: user.id
        });      

        return this.buildProfileResponse(user, false);
    }

    buildProfileResponse(user:UserEntity, following: boolean): ProfileResponseInterface {
        return {
            profile: {
                id: user.id,
                username: user.username,
                bio: user.bio,
                image: user.image,
                following
            }
        }
    }
}
