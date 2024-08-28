import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Post } from './models/post.model';
import { UpdatePostInput } from './dto/updatePost.input';
import { PostIdArgs } from './args/post-id.args';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async updatePost(id: PostIdArgs, data: UpdatePostInput): Promise<Post> {
    return this.prisma.post.update({
      where: { id: id.postId },
      data,
    });
  }
}