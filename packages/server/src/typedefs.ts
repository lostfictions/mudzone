import { gql } from "apollo-server";

export default gql`
  type Subscription {
    entityChanged(id: String!): Entity!
    messageReceived(channel: String): Message!
  }

  type Mutation {
    move(direction: Direction!): Position
    sendMessage(channel: String!, message: String!): Message
  }

  type Query {
    room(id: String!): Room
  }

  type Position {
    x: Int!
    y: Int!
  }

  type Message {
    channel: String!
    author: String!
    text: String!
  }

  type Entity {
    id: String!
    appearance: String!
    color: String!
    position: Position!
  }

  type Room {
    width: Int!
    height: Int!
  }

  enum Direction {
    UP
    DOWN
    LEFT
    RIGHT
  }
`;
