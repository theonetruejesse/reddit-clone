import { ApolloCache } from "@apollo/client";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import gql from "graphql-tag";
import React from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  voteType: boolean,
  postId: string,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: string;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  let value: number = voteType ? 1 : -1;

  const originalValue = value;

  if (data) {
    if (data.voteStatus === value) {
      value = 0;
    }
    // handles edge cases: new vote, undo vote, change votes
    const newPoints =
      (data.points as number) +
      (data.voteStatus ? 2 : 1) * (value ? value : (-1 / 2) * originalValue);

    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment _ on Post {
          points
          voteStatus
        }
      `,
      data: {
        points: newPoints,
        voteStatus: value ? value : null,
      },
    });
  }
};

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [vote] = useVoteMutation();
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
        onClick={async () =>
          await vote({
            variables: { voteType: true, postId: post.id },
            update: (cache) => updateAfterVote(true, post.id, cache),
          })
        }
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
        onClick={async () =>
          await vote({
            variables: { voteType: false, postId: post.id },
            update: (cache) => updateAfterVote(false, post.id, cache),
          })
        }
      />
    </Flex>
  );
};
