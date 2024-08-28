import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Subscription,
  Mutation,
} from '@nestjs/graphql';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Post } from './models/post.model';
import { PostConnection } from './models/post-connection.model';
import { PostOrder } from './dto/post-order.input';
import { CreatePostInput } from './dto/createPost.input';
import { Logger } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostInput } from './dto/updatePost.input';

const pubSub = new PubSub();

@Resolver(() => Post)
export class PostsResolver {
  private readonly logger = new Logger(PostsResolver.name);
  constructor(
    private prisma: PrismaService,
    private postsService : PostsService

  ) { }

  @Subscription(() => Post)
  postCreated() {
    return pubSub.asyncIterator('postCreated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @UserEntity() user: User,
    @Args('data') data: CreatePostInput,
  ) {
    const newPost = this.prisma.post.create({
      data: {
        published: false,
        title: data.title,
        content: data.content,
        authorId: user.id,
      },
    });
    pubSub.publish('postCreated', { postCreated: newPost });
    return newPost;
  }

  @Query(() => PostConnection)
  async publishedPosts(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => PostOrder,
      nullable: true,
    })
    orderBy: PostOrder,
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.post.findMany({
          include: { author: true },
          where: {
            published: true,
            title: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
        }),
      () =>
        this.prisma.post.count({
          where: {
            published: true,
            title: { contains: query || '' },
          },
        }),
      { first, last, before, after },
    );
    return a;
  }

  @Query(() => [Post])
  userPosts(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .posts({ where: { published: true } });

    // or
    // return this.prisma.posts.findMany({
    //   where: {
    //     published: true,
    //     author: { id: id.userId }
    //   }
    // });
  }

  @Query(() => Post)
  async post(@Args('id') id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @Args('id') id: PostIdArgs,
    @Args('data') data: UpdatePostInput,
  ): Promise<Post> {
    return this.postsService.updatePost(id, data);
  }

  @ResolveField('author', () => User)
  async author(@Parent() post: Post) {
    return this.prisma.post.findUnique({ where: { id: post.id } }).author();
  }
}
