import { gql } from "apollo-server";

import { Resolvers } from "../generated/graphql";

export const typeDefs = gql`
  extend type Query {
    room(id: String!): Room
  }

  type Room {
    id: String!
    name: String!
    width: Int!
    height: Int!
    entities: [Entity!]!
  }
`;

export const resolvers: Resolvers = {
  Query: {
    room(_parent, { id }, context) {
      return context.store.rooms.findOne({ id: { $eq: id } }).exec();
    }
  },
  Room: {
    entities(parent, _args, _context) {
      return parent.populate("entities");
    }
  }
};
