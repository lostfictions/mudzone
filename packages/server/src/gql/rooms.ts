import { gql } from "apollo-server";

import { Resolvers } from "../generated/graphql";

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
      return context.store.rooms.findOne({ id: { $eq: id } }).exec();
    }
  }
};
