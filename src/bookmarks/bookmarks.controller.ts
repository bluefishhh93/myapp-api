import { Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { RestAuthGuard } from '../auth/rest-auth.guard';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';

@Controller('post')
export class BookmarksController {
    constructor(private bookmarksService: BookmarksService) { }

    @Put(':postId/toggle-bookmark')
    @UseGuards(RestAuthGuard)
    async toggleBookmarkPost(
        @UserEntity() user: User,
        @Param('postId') postId: string,
    ) {
        const result = await this.bookmarksService.toggleBookmark(user.id, postId);
        return { isBookmarked: result };
    }

    @Post(':postId/bookmark')
    @UseGuards(RestAuthGuard)
    async bookmarkPost(
        @UserEntity() user: User,
        @Param('postId') postId: string,
    ) {
        return await this.bookmarksService.bookmark(user.id, postId);
    }

    @Delete(':postId/unbookmark')
    @UseGuards(RestAuthGuard)
    async unbookmarkPost(
        @UserEntity() user: User,
        @Param('postId') postId: string,
    ) {
        return await this.bookmarksService.unbookmark(user.id, postId);
    }

    @Get(':userId/:postId')
    async isPostSavedByUser(
        @Param('userId') userId: string,
        @Param('postId') postId: string,
    ): Promise<{ saved: boolean }> {
        const saved = await this.bookmarksService.isPostSavedByUser(postId, userId);
        if (saved === null) {
            throw new NotFoundException('Bookmark not found');
        }
        return { saved };
    }

    // @Get()
    // @UseGuards(RestAuthGuard)
    // async getBookmarkedPosts(@UserEntity() user: User) {
    //     return this.bookmarksService.getBookmarkedPosts(user.id);
    // }

}