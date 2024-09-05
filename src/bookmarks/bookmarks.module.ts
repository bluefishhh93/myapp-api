import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksResolver } from './bookmarks.resolver';
import { BookmarksController } from './bookmarks.controller';

@Module({
  imports: [],
  providers: [BookmarksService, BookmarksResolver ],
  controllers: [BookmarksController],
})
export class BookmarksModule {}

