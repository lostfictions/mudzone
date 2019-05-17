import React from "react";
import { ApolloProvider } from "react-apollo-hooks";

import { makeClient } from "./init-apollo";
import ChatBox from "./components/ChatBox";
import Room from "./components/Room";

import styles from "./App.module.css";

const client = makeClient();

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className={styles.flexcontainer}>
          <Room />
          <ChatBox />
        </div>
      </ApolloProvider>
    );
  }
}
