import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import {
  PostSnippetFragment,
  useDeletePostMutation,
} from "../generated/graphql";
import NextLink from "next/link";

interface IconsSectionProps {
  post: PostSnippetFragment;
}

export const PostButtons: React.FC<IconsSectionProps> = ({ post }) => {
  const [, deletePost] = useDeletePostMutation();

  return (
    <Flex ml="auto" mt="auto">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${post.id}`}>
        <IconButton
          aria-label="edit button"
          shadow="md"
          size="sm"
          border="2px"
          borderColor="grey"
          m={2}
          icon={<EditIcon boxSize="18px" />}
        />
      </NextLink>
      <IconButton
        aria-label="delete button"
        shadow="md"
        size="sm"
        border="2px"
        borderColor="grey"
        m={2}
        icon={<DeleteIcon boxSize="18px" />}
        onClick={() => {
          deletePost({ id: post.id });
        }}
        // hidden={post.creator.id !== me.id}
      />
    </Flex>
  );
};

// export withUrqlClient(createUrqlClient,{ ssr: true })(IconsSection);
