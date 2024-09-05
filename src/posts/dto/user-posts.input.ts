import { Field, InputType } from "@nestjs/graphql";
import { Status } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";


@InputType()
export class UserPostsInput{
    @Field()
    userId: string;

    @Field({ nullable: true })
    published?: boolean;
  
    @Field({ nullable: true })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
    
}