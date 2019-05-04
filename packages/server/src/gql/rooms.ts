import { gql } from "apollo-server";

import { Resolvers } from "../generated/graphql";

export const CHAT_MESSAGE = "CHAT_MESSAGE";

export const typeDefs = gql`
  extend type Query {
    room(id: String!): Room
  }

  type Room {
    id: String!
    width: Int!
    height: Int!
  }
`;

export const resolvers: Resolvers = {
  Query: {
    room(_parent, { id }, context) {
      return context.store.db.getCollection("rooms").by("id", id) || null;
    }
  }
};
