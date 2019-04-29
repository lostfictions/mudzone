import React from "react";
import { ApolloProvider } from "react-apollo-hooks";

import { makeClient } from "./init-apollo";
import ChatBox from "./components/ChatBox";
import Room from "./components/Room";

const client = makeClient();

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Room />
        <ChatBox />
      </ApolloProvider>
    );
  }
}
