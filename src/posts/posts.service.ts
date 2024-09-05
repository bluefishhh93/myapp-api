import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdatePostInput } from './dto/updatePost.input';
import { PostIdArgs } from './args/post-id.args';
import { Post, Status } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async updatePost(id: PostIdArgs, data: UpdatePostInput): Promise<Post> {
    return this.prisma.post.update({
      where: { id: id.postId },
      data: {
        ...data,
        updatedAt: new Date(),  
      }
    });
  }

  async getLastDraftIdByUser(userId: string): Promise<string> {
    const post = await this.prisma.post.findFirst({

      where: {
        authorId: userId,
        status : Status.INACTIVE
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });

    return post ? post.id : null;
  }

  async deletePostById(userId: string, postId: string): Promise<boolean> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this post');
    }

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return true;
  }
}