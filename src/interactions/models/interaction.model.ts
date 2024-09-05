import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { InteractionType } from "@prisma/client";
import { BaseModel } from '../../common/models/base.model';
import { Post } from "../../posts/models/post.model";
import { User } from "../../users/models/user.model";

registerEnumType(InteractionType, {
    name: 'InteractionType',
    description: 'The type of interaction',
  });
  
@ObjectType()
export class Interaction extends BaseModel {
    @Field(() => InteractionType)
    type: InteractionType;

    @Field(()=> User)
    user: User;

    @Field(()=> Post)
    post: Post;
}