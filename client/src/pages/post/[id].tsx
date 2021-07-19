import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Layout } from "../../components/Layout";
import { Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const Post = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();
  const router = useRouter();

  if (!fetching && !data) {
    return <div>your query failed for some reason</div>;
  } else if (!data && fetching) {
    return <div>loading...</div>;
  } else if (!data!.post && !fetching) {
    <div>post does not exist</div>;
  }

  return (
    <Layout>
      <Flex flexDirection="row" align="center">
        <IconButton
          aria-label="return back"
          icon={<ArrowBackIcon boxSize="24px"/>}
          onClick={() => router.back()}
        ></IconButton>
        <Heading ml={4}>{data?.post?.title}</Heading>
      </Flex>
      <br />
      <Text>{data?.post?.text}</Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
