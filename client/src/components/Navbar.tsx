import { Flex, Link, Box, Button } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { AiOutlineHome } from "react-icons/ai";
import { useRouter } from "next/router"

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body;
  const homeIconStyle = { fontSize: "24px" };

  if (fetching) {
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
          onClick={ async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
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
