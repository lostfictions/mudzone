import { gql } from "apollo-server";

export default gql`
  type Subscription {
    booped: String
  }

  type Mutation {
    sendMessage(author: String, message: String): String
  }

  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;
