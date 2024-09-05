import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/models/user.model";

@ObjectType()
export class PostInteraction {
    @Field(() => Int)
    heart: number;

    @Field(() => [User])
    likedBy: User[];
}