import { Field, ObjectType,   registerEnumType} from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { BaseModel } from '../../common/models/base.model';
import { Status } from '@prisma/client';

registerEnumType(Status, {
  name: 'Status',
  description: 'Post status',
});

@ObjectType()
export class Post extends BaseModel {
  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  content?: string | null;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => User, { nullable: true })
  author?: User | null;
  
  @Field(() => Status)
  status: Status;

}
