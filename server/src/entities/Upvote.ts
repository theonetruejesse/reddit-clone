import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  PrimaryColumn,
  Column,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
  @Field()
  @Column({type: "int"})
  value: number

  @Field()
  @PrimaryColumn()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.upvotes)
  user: User;

	@Field()
	@PrimaryColumn()
	postId: string;

	@Field(() => Post)
  @ManyToOne(() => Post, post => post.upvotes)
	post: Post;

}
