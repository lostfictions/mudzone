import { gql, withFilter } from "apollo-server";

import { Resolvers, RoomChange } from "../generated/graphql";
import pubSub from "../pub-sub";

export const ROOM_CHANGED = "ROOM_CHANGED";

export const typeDefs = gql`
  extend type Subscription {
    roomChanged(id: String!): RoomChange!
  }

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

  type RoomChange {
    name: String
    width: Int
    height: Int
    joined: [Entity!]
    left: [Entity!]
  }
`;

export const resolvers: Resolvers = {
  Subscription: {
    roomChanged: {
      subscribe: withFilter(
        () => pubSub.asyncIterator<RoomChange>(ROOM_CHANGED),
        (payload, variables) => payload.id === variables.id
      )
      // skip having to do an additional db lookup on id
      // resolve(iteratorResult: any) {
      //   return iteratorResult;
      // }
    }
  },
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
