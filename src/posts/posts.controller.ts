import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { RestAuthGuard } from '../auth/rest-auth.guard';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';

@Controller('post')
export class PostController{
    constructor(private postService: PostsService){}

    //get last draft id by user
    @Get('last-draft-id')
    @UseGuards(RestAuthGuard)
    async getLastDraftIdByUser(@UserEntity() user: User): Promise<string>{
        console.log(user);
        return await this.postService.getLastDraftIdByUser(user.id);
    }

    @Delete(':postId')
    @UseGuards(RestAuthGuard)
    async deletePostById(@UserEntity() user: User, @Param('postId') postId: string): Promise<boolean> {
        return await this.postService.deletePostById(user.id, postId);
    }
    
}