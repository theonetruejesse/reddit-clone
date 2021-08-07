import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Box, Button, Link, Heading } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

const ForgotPassword: React.FC = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  return (
    <Wrapper variant="small">
      <Box mb="5">
        <Heading>Forgot Password</Heading>
      </Box>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: { email: values.email } });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>Check your inbox</Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
                my={4}
              >
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
      <NextLink href="register">
        <Link>Don't have an account? Register here.</Link>
      </NextLink>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
