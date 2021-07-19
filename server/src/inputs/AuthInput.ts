import {
  Field,
  InputType
} from "type-graphql";


@InputType()
export class AuthInput {
  @Field()
  password: string;

  @Field()
  username: string;

  @Field()
  email: string;
}

