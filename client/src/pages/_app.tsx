import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import React from "react";
import theme from "../theme";
// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   useQuery,
//   gql
// } from "@apollo/client";

// const client = new ApolloClient({
//   uri: "http://localhost:4000/graphql",
//   credentials: "includes",
//   cache: new InMemoryCache()
// });

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {/* <ApolloProvider client={client}> */}
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      {/* </ApolloProvider> */}
    </ChakraProvider>
  );
}

export default MyApp;
