import React from "react";
import { ApolloProvider } from "react-apollo-hooks";

import { makeClient } from "./init-apollo";
import ChatBox from "./ChatBox";

const client = makeClient();

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ChatBox />
      </ApolloProvider>
    );
  }
}
