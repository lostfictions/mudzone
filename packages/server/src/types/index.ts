import { resolvers as MessageResolvers } from "./messages";
import { resolvers as EntityResolvers } from "./entities";
import { resolvers as RoomResolvers } from "./rooms";
import { DateTime } from "@okgrow/graphql-scalars";
import merge from "lodash.merge";

export const resolvers = merge(
  { DateTime },
  MessageResolvers,
  EntityResolvers,
  RoomResolvers
);

export { default as typeDefs } from "./typedefs";
