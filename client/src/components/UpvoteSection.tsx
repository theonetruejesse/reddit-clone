import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  return (
    <Flex flexDirection="column" align="center" mr="32px">
      <IconButton
        aria-label="downvote button"
        colorScheme="grey"
        size="sm"
        m={2}
        isRound
        icon={<ChevronUpIcon boxSize="24px" />}
        backgroundColor={post.voteStatus === 1 ? "teal" : undefined}
        color={post.voteStatus === 1 ? "white" : "black"}
        onClick={async () => await vote({ voteType: true, postId: post.id })}
      />
      {post.points}
      <IconButton
        aria-label="downvote button"
        colorScheme="grey"
        size="sm"
        m={2}
        isRound
        icon={<ChevronDownIcon boxSize="24px" />}
        backgroundColor={post.voteStatus === -1 ? "tomato" : undefined}
        color={post.voteStatus === -1 ? "white" : "black"}
        onClick={async () => await vote({ voteType: false, postId: post.id })}
      />
    </Flex>
  );
};
