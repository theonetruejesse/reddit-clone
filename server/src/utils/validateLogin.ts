import { User } from "../entities/User";
import argon2 from "argon2";

export const validateLogin = async (user: User | undefined, password: string) => {
  if (!user) {
    return [
      {
        field: "email",
        message: "email does not exist",
      },
    ];
  }

  const valid = await argon2.verify(user!.password, password);
  if (!valid) {
    return [
      {
        field: "password",
        message: "invalid login",
      },
    ];
  }

  return null;
};
