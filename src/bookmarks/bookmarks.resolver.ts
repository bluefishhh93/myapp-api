import { Resolver, Query } from "@nestjs/graphql";
import { BookmarksService } from "./bookmarks.service";
import { Bookmark } from "./models/bookmark.model";
import { Post } from "../posts/models/post.model";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { UserEntity } from "../common/decorators/user.decorator";
import { User } from "../users/models/user.model";

@Resolver(() => Bookmark)
export class BookmarksResolver {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @Query(() => [Post])
    @UseGuards(GqlAuthGuard)
    async bookmarkedPosts(@UserEntity() user: User) {
        return this.bookmarksService.getBookmarkedPosts(user.id);
    }
}