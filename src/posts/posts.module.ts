import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  imports: [],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
