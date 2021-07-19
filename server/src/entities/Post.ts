import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BeforeInsert,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { v4 } from "uuid";
import { Upvote } from "./Upvote";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id!: string;

  @Field()
  @Column({ type: "text" })
  title!: string;

  @Field()
  @Column({ type: "text" })
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Int, {nullable: true})
  voteStatus: number | null;

  @Field()
  @Column()
  creatorId: string;

  @Field()
  @ManyToOne(() => User, user => user.posts)
  creator: User;

  @OneToMany(() => Upvote, (upvote) => upvote.post)
  upvotes: Upvote[]; 

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
