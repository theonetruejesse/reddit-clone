import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Link, Heading, Flex } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Login: React.FC = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Box mb="5">
        <Heading>Login</Heading>
      </Box>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            password: values.password,
            usernameOrEmail: values.usernameOrEmail,
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (!response.data?.login.errors) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
          return response;
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box mt={3}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex alignContent="column" align="center">
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
                my={4}
              >
                login
              </Button>
              <NextLink href="forgot-password">
                <Link ml="auto">Forgot password? Click here.</Link>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
      <NextLink href="register">
        <Link>Don't have an account? Register here.</Link>
      </NextLink>
      <br />
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
