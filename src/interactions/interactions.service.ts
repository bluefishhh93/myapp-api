import { Injectable } from "@nestjs/common";
import { Interaction, InteractionType } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { PostInteraction } from "src/interactions/models/post.interaction.model";
import { UserInteraction } from "src/interactions/models/user.interaction";


@Injectable()
export class InteractionsService{
    constructor(private readonly prisma: PrismaService) { }

    async interactWithPost(userId: string, postId: string, type: InteractionType): Promise<Interaction> {
        const existingInteraction = await this.prisma.interaction.findUnique({
            where: {
                userId_postId_type: {
                    userId,
                    postId,
                    type
                }
            }
        });

        if (existingInteraction) {
            return await this.prisma.interaction.delete({
                where: { id: existingInteraction.id },
                include: { user: true, post: true }

            })
        } else {
            return await this.prisma.interaction.create({
                data: {
                    userId,
                    postId,
                    type
                },
                include: { user: true, post: true }
            })
        }

    }

    async getPostInteractions(postId: string): Promise<PostInteraction> {
        const interactions = await this.prisma.interaction.findMany({
            where: {
                postId,
                type: InteractionType.HEART
            },
            include: {
                user: true
            }
        });
        
        return {
            heart: interactions.length,
            likedBy: interactions.map(interaction => interaction.user)
        };
    }


    async getUserInteractions(userId: string, postId: string): Promise<UserInteraction>{
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        })

        const heart = await this.prisma.interaction.findUnique({
            where: {
                userId_postId_type: {
                    userId,
                    postId,
                    type: InteractionType.HEART
                }
            }
        })

        return {
            bookmarked: !!bookmark,
            hearted: !!heart
        }
    }
}