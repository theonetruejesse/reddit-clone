import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Link, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Box mb="5">
        <Heading>Register</Heading>
      </Box>
      <Formik
        initialValues={{ password: "", email: "", username: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (!response.data?.register.errors) {
            router.push("/");
          }
          return response;
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={3}>
              <InputField name="email" placeholder="email" label="Email" />
            </Box>
            <Box mt={3}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
              my={4}
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
      <Box mt="5">
        <NextLink href="login">
          <Link>Have an account already? Login here.</Link>
        </NextLink>
      </Box>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
