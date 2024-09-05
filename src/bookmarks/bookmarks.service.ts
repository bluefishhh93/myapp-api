import { Injectable } from "@nestjs/common";
import { Bookmark, InteractionType, Post } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class BookmarksService {
    constructor(private readonly prisma: PrismaService) { }

    async isPostSavedByUser(postId: string, userId: string): Promise<boolean> {
        const bookmark = await this.prisma.bookmark.findUnique({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
        return !!bookmark;
      }

      async toggleBookmark(userId: string, postId: string): Promise<boolean> {
        const existingBookmark = await this.prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
    
        if (existingBookmark) {
            await this.prisma.bookmark.delete({
                where: { id: existingBookmark.id },
            });
            return false;
        } else {
            await this.prisma.bookmark.create({
                data: {
                    userId,
                    postId,
                },
            });
            return true;
        }
    }

    async bookmark(userId: string, postId: string): Promise<boolean> {
      await this.prisma.bookmark.create({
        data: {
          userId,
          postId,
        },
      });
      return true;
    }

    async unbookmark(userId: string, postId: string): Promise<boolean> {
      const existingBookmark = await this.prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
  
      if (existingBookmark) {
        await this.prisma.bookmark.delete({
          where: { id: existingBookmark.id },
        });
        return false;
      }
      return false;
    }

    // async getBookmarkedPosts(userId: string): Promise<Post[]> {
    //     const bookmarks = await this.prisma.bookmark.findMany({
    //         where: { userId },
    //         include: {
    //             post: {
    //                 include: {
    //                     // bookmarks: true,
    //                     interactions: true,
    //                 }
    //             }
    //         }

    //     })

    //     return bookmarks.map(bookmark => ({
    //         ...bookmark.post,
    //         // bookmarkCount: bookmark.post.bookmarks.length,
    //         heartCount: bookmark.post.interactions.filter(i => i.type === InteractionType.HEART).length,
    //     }));
    // }
    // async getBookmarkedPosts(userId: string): Promise<Post[]> {
    //     return this.prisma.post.findMany({
    //       where: {
    //         bookmarks: {
    //           some: { userId }
    //         }
    //       },
    //       include: {
    //         // bookmarks: true,
    //         // interactions: true,
    //       }
    //     });
    //   }
    async getBookmarkedPosts(userId: string): Promise<Post[]> {
        return this.prisma.post.findMany({
          where: { bookmarks: { some: { userId } } },
          include: {
            bookmarks: { where: { userId }, select: { id: true } },
            interactions: { where: { type: 'HEART' } },
          }
        }).then(posts => posts.map(post => ({
          ...post,
          heartCount: post.interactions.length,
          bookmarks: undefined,
          interactions: undefined,
        })));
      }

    
}