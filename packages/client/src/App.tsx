import React from "react";
import { ApolloProvider } from "react-apollo-hooks";

import { makeClient } from "./init-apollo";
import Message from "./Message";

const client = makeClient();

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Message />
      </ApolloProvider>
    );
  }
}
