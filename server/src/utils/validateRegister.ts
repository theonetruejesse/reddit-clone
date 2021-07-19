import { AuthInput } from "../inputs/AuthInput";

export const validateRegister = (options: AuthInput) => {

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username can't contain @"
      }
    ]
  }

  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (options.password.length <= 3) {
    return [
      {
        field: "password",
        message: "password length needs to be greater than 3",
      },
    ];
  }
  
  return null;
};
