import { Box, Heading, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";
import { useIsAuth } from "../../../utils/useIsAuth";
import { withApollo } from "../../../utils/withApollo";

const EditPost = ({}) => {
  useIsAuth();
  const router = useRouter();
  const { data, loading } = useGetPostFromUrl();
  const [updatePost] = useUpdatePostMutation();

  if (!loading && !data) {
    return <div>your query failed for some reason</div>;
  } else if (!data && loading) {
    return <div>loading...</div>;
  } else if (!data!.post && !loading) {
    <div>post does not exist</div>;
  }

  return (
    <Layout variant="small">
      <Box mb="5">
        <Heading>Update Post</Heading>
      </Box>
      <Formik
        initialValues={{ title: data!.post!.title, text: data!.post!.text }}
        onSubmit={async (values) => {
          await updatePost({
            variables: {
              title: values.title,
              text: values.text,
              id: data!.post!.id,
            },
          });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={3}>
              <InputField
                name="text"
                placeholder="text.."
                textarea
                label="Body"
              />
            </Box>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
              mt={4}
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
