import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { InteractionsService } from "./interactions.service";
import { InteractionType } from "@prisma/client";
import { Interaction } from "./models/interaction.model";
import { PostInteraction } from "./models/post.interaction.model";
import { UserInteraction } from "./models/user.interaction";
import { UserEntity } from "../common/decorators/user.decorator";
import { User } from "../users/models/user.model";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/gql-auth.guard";


@Resolver(() => Interaction)
export class InteractionsResolver {
    constructor(private readonly interactionsService: InteractionsService) { }

    @Mutation(() => Interaction)
    @UseGuards(GqlAuthGuard)
    async interactWithPost(
        @UserEntity() user: User,
        @Args('postId') postId: string,
        @Args('type') type: InteractionType,
    ) {
        return this.interactionsService.interactWithPost(user.id, postId, type);
    }

    @Query(() => PostInteraction)
    async postInteractions(@Args('postId') postId: string) {
        return this.interactionsService.getPostInteractions(postId);
    }

    @Query(() => UserInteraction)
    @UseGuards(GqlAuthGuard)
    async getUserInteractions(
        @UserEntity() user: User,
        @Args('postId') postId: string
    ): Promise<UserInteraction> {
        return this.interactionsService.getUserInteractions(user.id, postId);
    }

}