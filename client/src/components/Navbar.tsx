import { Flex, Link, Box, Button } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { AiOutlineHome } from "react-icons/ai";
import { useApolloClient } from "@apollo/client";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const apolloClient = useApolloClient();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body;
  const homeIconStyle = { fontSize: "24px" };

  if (loading) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={2}>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={5}>{data.me.username}</Box>
        <Button
          variant="link"
          mr={2}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutLoading}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tan" position="sticky" top={0} zIndex={1} py={4}>
      <Flex align="center" m="auto" maxW={800} flex={1}>
        <NextLink href="/">
          <AiOutlineHome style={homeIconStyle} />
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
