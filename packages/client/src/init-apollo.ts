import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink /* split */ } from "apollo-link";
// import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { WebSocketLink } from "apollo-link-ws";
// import { getMainDefinition } from "apollo-utilities";

const HOST = `${process.env.REACT_APP_API_HOSTNAME}:${
  process.env.REACT_APP_API_PORT
}`;

export function makeClient() {
  // const httpLink = new HttpLink({
  //   uri: `http://${HOST}`
  // });

  const wsLink = new WebSocketLink({
    uri: `ws://${HOST}/graphql`,
    options: {
      reconnect: true
    }
  });

  const link = wsLink;

  // const link = split(
  //   // split based on operation type
  //   ({ query }) => {
  //     const def = getMainDefinition(query);
  //     return (
  //       def.kind === "OperationDefinition" && def.operation === "subscription"
  //     );
  //   },
  //   wsLink,
  //   httpLink
  // );

  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              "[GraphQL error]: Message:",
              message,
              "\nLocation:",
              locations,
              "\nPath:",
              path
            )
          );
        }
        if (networkError) {
          console.log("[Network error]", networkError);
        }
      }),
      link
    ]),
    cache: new InMemoryCache()
  });

  return client;
}
