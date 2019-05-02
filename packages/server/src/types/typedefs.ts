import { gql } from "apollo-server";

import { DateTimeScalar } from "@okgrow/graphql-scalars";

import { typeDefs as Messages } from "./messages";
import { typeDefs as Entities } from "./entities";
import { typeDefs as Rooms } from "./rooms";

// We can't extend types that haven't been defined, so this basic definition is
// necessary. See explanation here:
// https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2#14ac
const baseTypeDefs = gql`
  type Subscription {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Query {
    _empty: String
  }
`;

export default [baseTypeDefs, gql(DateTimeScalar), Messages, Entities, Rooms];
