import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
@ArgsType()
@InputType()
export class PostIdArgs {
  @Field()
  @IsNotEmpty()
  postId: string;
}