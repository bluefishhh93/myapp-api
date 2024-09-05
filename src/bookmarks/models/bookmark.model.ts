import { Field, ObjectType } from "@nestjs/graphql";
import { BaseModel } from "../../common/models/base.model";
import { User } from "../../users/models/user.model";
import { Post } from "../../posts/models/post.model";


@ObjectType()
export class Bookmark extends BaseModel{
    @Field(() => User)
    user: User;

    @Field(() => Post)
    post: Post;
}