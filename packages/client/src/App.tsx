import React from "react";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import gql from "graphql-tag";
import { Subscription, ApolloProvider, SubscriptionResult } from "react-apollo";

const httpLink = new HttpLink({
  uri: "http://localhost:4000"
  // uri: "https://graphql-pokemon.now.sh/"
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
});

// const link = httpLink;
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    link
  ]),
  cache: new InMemoryCache()
});

const LOCALSUB = gql`
  subscription {
    booped
  }
`;

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Subscription subscription={LOCALSUB}>
          {({ loading, error, data }: SubscriptionResult<any>) => {
            if (loading) {
              return <div>Loading...</div>;
            }

            if (error) {
              console.error(error);
              return <div>Error! [{error}]</div>;
            }

            return <div>{data.booped}!</div>;
          }}
        </Subscription>
      </ApolloProvider>
    );
  }
}
