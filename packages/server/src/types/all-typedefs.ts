import { gql } from "apollo-server";

import { DateTimeScalar } from "@okgrow/graphql-scalars";

import typeDefs from "./typedefs";

import { typeDefs as Messages } from "./messages";
import { typeDefs as Entities } from "./entities";
import { typeDefs as Rooms } from "./rooms";

export default [gql(DateTimeScalar), typeDefs, Messages, Entities, Rooms];
