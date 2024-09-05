import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserInteraction{
    @Field(()=> Boolean)
    bookmarked: boolean;

    @Field(()=> Boolean)
    hearted: boolean;
}