import { Layout } from "../../components/Layout";
import { Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { withApollo } from "../../utils/withApollo";

const Post = ({}) => {
  const { data, loading } = useGetPostFromUrl();
  const router = useRouter();

  if (!loading && !data) {
    return <div>your query failed for some reason</div>;
  } else if (!data && loading) {
    return <div>loading...</div>;
  } else if (!data!.post && !loading) {
    <div>post does not exist</div>;
  }

  return (
    <Layout>
      <Flex flexDirection="row" align="center">
        <IconButton
          aria-label="return back"
          icon={<ArrowBackIcon boxSize="24px" />}
          onClick={() => router.back()}
        ></IconButton>
        <Heading ml={4}>{data?.post?.title}</Heading>
      </Flex>
      <br />
      <Text>{data?.post?.text}</Text>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
