import { Field, Int, ObjectType,   registerEnumType} from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { BaseModel } from '../../common/models/base.model';
import { Status } from '@prisma/client';
import { Bookmark } from '../../bookmarks/models/bookmark.model';
import { Interaction } from '../../interactions/models/interaction.model';

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

  // @Field(() => [Bookmark], { nullable: true })
  // bookmarks?: Bookmark[];

  // @Field(() => [Interaction], { nullable: true })
  // interactions?: Interaction[];

  @Field(() => Int)
  bookmarkCount: number;

  @Field(() => Int)
  heartCount: number;
}
