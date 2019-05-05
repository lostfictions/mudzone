import { gql } from "apollo-server";
import { withFilter } from "apollo-server";
import uuid from "uuid/v4";

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
    id: String!
    time: String!
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
    async sendMessage(_root, { message: text, channel }, context) {
      const { name: author } = context.userData!;

      const { messages } = context.store;

      const message: Message = {
        id: uuid(),
        time: new Date().toISOString(),
        author,
        text,
        channel
      };

      await messages.insert(message);

      return message;
    }
  },
  Query: {
    message(_root, { id }, context) {
      return context.store.messages.findOne({ id: { $eq: id } }).exec();
    },
    messages(_root, { channel }, context) {
      return context.store.messages.find({ channel: { $eq: channel } }).exec();
    }
  }
};
