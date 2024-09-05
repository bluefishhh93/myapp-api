import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { PostController } from './posts.controller';

@Module({
  imports: [],
  providers: [PostsResolver, PostsService],
  controllers: [PostController],
})
export class PostsModule {}
