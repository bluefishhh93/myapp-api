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
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Post } from './models/post.model';
import { PostConnection } from './models/post-connection.model';
import { CreatePostInput } from './dto/createPost.input';
import { Logger } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostInput } from './dto/updatePost.input';
import { UserPostsInput } from './dto/user-posts.input';
import { PublishedPostsArgs } from './args/published-posts.args';

const pubSub = new PubSub();

@Resolver(() => Post)
export class PostsResolver {
  private readonly logger = new Logger(PostsResolver.name);
  constructor(
    private prisma: PrismaService,
    private postsService: PostsService

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
  async publishedPosts(@Args() args: PublishedPostsArgs) {
    const { after, before, first, last, query, orderBy } = args;

    return await findManyCursorConnection(
      (paginationArgs) =>
        this.prisma.post.findMany({
          include: { author: true },
          where: {
            published: true,
            title: query ? { contains: query, mode: 'insensitive' } : undefined,
          },
          orderBy: orderBy
            ? [
              { [orderBy.field]: orderBy.direction },
              {
                id: 'desc',
              },
            ]
            : undefined,
          ...paginationArgs,
        }),
      () =>
        this.prisma.post.count({
          where: {
            published: true,
            title: query ? { contains: query, mode: 'insensitive' } : undefined,
          },
        }),
      { first, last, before, after },
    );
  }

  @Query(() => [Post])
  userPosts(@Args('input') input: UserPostsInput) {
    const { userId, published, status } = input;
    const where: any = {};
    if (published !== undefined) {
      where.published = published;
    }
    if (status) {
      where.status = status;
    }
    console.log('where', where);
    return this.prisma.user
      .findUnique({ where: { id: userId } })
      .posts({
        where,
        orderBy: {
          updatedAt: 'desc',
        }
      });
  }

  @Query(() => [Post])
  publishedUserPosts(@Args() id: UserIdArgs) {
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
  async post(@Args('id') id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        bookmarks: true,
        interactions: {
          where: {
            type: 'HEART'
          }
        },
      }
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return {
      ...post,
      heartCount: post.interactions.length,
      bookmarks: undefined,
      // interactions: undefined,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @Args('id') id: PostIdArgs,
    @Args('data') data: UpdatePostInput,
  ) {
    return this.postsService.updatePost(id, data);
  }

  @ResolveField('author', () => User)
  async author(@Parent() post: Post) {
    return this.prisma.post.findUnique({ where: { id: post.id } }).author();
  }
}
