import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  Entity,
  BeforeInsert,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { v4 } from "uuid";
import { Post } from "./Post";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id!: string;

  @Field()
  @Column({ type: "text", unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany(() => Upvote, (upvote) => upvote.user)
  upvotes: Upvote[]; 

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  addId() {
    const uuid = v4();
    this.id = uuid;
  }
}
