import {ArgsType, Field} from '@nestjs/graphql';
import { PostOrder } from '../dto/post-order.input';
import { PaginationArgs } from '../../common/pagination/pagination.args';


@ArgsType()
export class PublishedPostsArgs extends PaginationArgs {
    @Field({ nullable: true })
    query?: string;
  
    @Field(() => PostOrder, { nullable: true })
    orderBy?: PostOrder;
}