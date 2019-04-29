import React from "react";
import gql from "graphql-tag";
import { Subscription, ApolloProvider, SubscriptionResult } from "react-apollo";

import { makeClient } from "./init-apollo";

const client = makeClient();

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
