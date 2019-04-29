/* eslint-disable */

export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE"
}

export type Mutation = {
  sendMessage?: Maybe<Scalars["String"]>;
};

export type MutationSendMessageArgs = {
  author?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
};

export type Query = {
  /** A simple type for getting started! */
  hello?: Maybe<Scalars["String"]>;
};

export type Subscription = {
  booped?: Maybe<Scalars["String"]>;
};

export type BoopedSubscriptionVariables = {};

export type BoopedSubscription = { __typename?: "Subscription" } & Pick<
  Subscription,
  "booped"
>;
import { DocumentNode } from "graphql";
import * as ReactApolloHooks from "react-apollo-hooks";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const BoopedDocument: DocumentNode = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "Booped" },
      variableDefinitions: [],
      directives: [],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "booped" },
            arguments: [],
            directives: []
          }
        ]
      }
    }
  ]
};

export function useBoopedSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    BoopedSubscription,
    BoopedSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    BoopedSubscription,
    BoopedSubscriptionVariables
  >(BoopedDocument, baseOptions);
}
