import { InputType, Field } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  //enum Status
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}