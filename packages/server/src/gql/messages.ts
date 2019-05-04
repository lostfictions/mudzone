import { gql } from "apollo-server";
import { withFilter } from "apollo-server";

import pubSub from "../pub-sub";
import { Message, Resolvers } from "../generated/graphql";

export const CHAT_MESSAGE = "CHAT_MESSAGE";

export const typeDefs = gql`
  extend type Subscription {
    messageReceived(channel: String): Message!
  }

  extend type Mutation {
    sendMessage(channel: String!, message: String!): Message
  }

  extend type Query {
    message(id: String!): Message
    messages(channel: String!): [Message!]
  }

  type Message {
    id: Int!
    time: DateTime!
    channel: String!
    author: String!
    text: String!
  }
`;

export const resolvers: Resolvers = {
  Subscription: {
    messageReceived: {
      subscribe: withFilter(
        () => pubSub.asyncIterator<Message>(CHAT_MESSAGE),
        (payload, variables) => payload.channel === variables.channel
      ),
      // skip having to do an additional db lookup on id
      resolve(iteratorResult: any) {
        return iteratorResult;
      }
    }
  },
  Mutation: {
    sendMessage(_root, { message: text, channel }, context) {
      const { name: author } = context.userData!;

      const { appState, db } = context.store;

      appState.messageCounter++;

      const message: Message = {
        id: appState.messageCounter,
        time: new Date(),
        author,
        text,
        channel
      };

      db.getCollection("messages").insertOne(message);
      // TODO: would be better to have a way to observe changes instead? for now
      // let's just ensure all state changes (even locally) happen through
      // resolvers.
      pubSub.publish(CHAT_MESSAGE, message);

      return message;
    }
  },
  Query: {
    message(_root, { id }, context) {
      return context.store.db.getCollection("messages").by("id", id) || null;
    },
    messages(_root, { channel }, context) {
      return (
        context.store.db.getCollection("messages").find({ channel }) || null
      );
    }
  }
};
