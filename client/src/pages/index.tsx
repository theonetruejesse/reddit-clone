import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Stack, Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { UpvoteSection } from "../components/UpvoteSection";
import { PostButtons } from "../components/PostButtons";

const Index = () => {
  const [{ data: meData }] = useMeQuery();
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  if (!fetching && !data) {
    return <div>your query failed for some reason</div>;
  }
  return (
    <Layout>
      <Flex align="center">
        <Heading>Reddit-Clone</Heading>
        <NextLink href="/create-post">
          <Button colorScheme="teal" ml="auto">
            Create Post
          </Button>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              key={post.id}
              _hover={{ shadow: "xl" }}
            >
              <Flex flexDirection="row" align="center">
                <UpvoteSection post={post} />
                <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                  <Flex flexDirection="column">
                    <Heading fontSize="xl">{post.title}</Heading>
                    <Text>posted by {post.creator.username}</Text>
                    <Text mt={4}>{post.textSnippet + "..."}</Text>
                  </Flex>
                </NextLink>
                {meData?.me?.id === post.creator.id ? (
                  <PostButtons post={post} />
                ) : null}
              </Flex>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            m="auto"
            isLoading={fetching}
            my={8}
            colorScheme="teal"
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
