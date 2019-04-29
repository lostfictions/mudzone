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

export enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

export type Entity = {
  id: Scalars["String"];
  appearance: Scalars["String"];
  color: Scalars["String"];
  position: Position;
};

export type Message = {
  channel: Scalars["String"];
  author: Scalars["String"];
  text: Scalars["String"];
};

export type Mutation = {
  move?: Maybe<Position>;
  sendMessage?: Maybe<Message>;
};

export type MutationMoveArgs = {
  direction: Direction;
};

export type MutationSendMessageArgs = {
  channel: Scalars["String"];
  message: Scalars["String"];
};

export type Position = {
  x: Scalars["Int"];
  y: Scalars["Int"];
};

export type Query = {
  room?: Maybe<Room>;
};

export type QueryRoomArgs = {
  id: Scalars["String"];
};

export type Room = {
  width: Scalars["Int"];
  height: Scalars["Int"];
};

export type Subscription = {
  entityChanged: Entity;
  messageReceived: Message;
};

export type SubscriptionEntityChangedArgs = {
  id: Scalars["String"];
};

export type SubscriptionMessageReceivedArgs = {
  channel?: Maybe<Scalars["String"]>;
};

export type EntityChangedSubscriptionVariables = {
  id: Scalars["String"];
};

export type EntityChangedSubscription = { __typename?: "Subscription" } & {
  entityChanged: { __typename?: "Entity" } & Pick<Entity, "id"> & {
      position: { __typename?: "Position" } & Pick<Position, "x" | "y">;
    };
};

export type MessageReceivedSubscriptionVariables = {
  channel: Scalars["String"];
};

export type MessageReceivedSubscription = { __typename?: "Subscription" } & {
  messageReceived: { __typename?: "Message" } & Pick<
    Message,
    "author" | "text"
  >;
};

export type MoveMutationVariables = {
  direction: Direction;
};

export type MoveMutation = { __typename?: "Mutation" } & {
  move: Maybe<{ __typename?: "Position" } & Pick<Position, "x" | "y">>;
};

export type SendMessageMutationVariables = {
  channel: Scalars["String"];
  message: Scalars["String"];
};

export type SendMessageMutation = { __typename?: "Mutation" } & {
  sendMessage: Maybe<{ __typename?: "Message" } & Pick<Message, "text">>;
};
import { DocumentNode } from "graphql";
import * as React from "react";
import * as ReactApollo from "react-apollo";
import * as ReactApolloHooks from "react-apollo-hooks";
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const EntityChangedDocument: DocumentNode = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "EntityChanged" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          },
          directives: []
        }
      ],
      directives: [],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "entityChanged" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
              }
            ],
            directives: [],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "id" },
                  arguments: [],
                  directives: []
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "position" },
                  arguments: [],
                  directives: [],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "x" },
                        arguments: [],
                        directives: []
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "y" },
                        arguments: [],
                        directives: []
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};

export const EntityChangedComponent = (
  props: Omit<
    Omit<
      ReactApollo.SubscriptionProps<
        EntityChangedSubscription,
        EntityChangedSubscriptionVariables
      >,
      "subscription"
    >,
    "variables"
  > & { variables?: EntityChangedSubscriptionVariables }
) => (
  <ReactApollo.Subscription<
    EntityChangedSubscription,
    EntityChangedSubscriptionVariables
  >
    subscription={EntityChangedDocument}
    {...props}
  />
);

export function useEntityChangedSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    EntityChangedSubscription,
    EntityChangedSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    EntityChangedSubscription,
    EntityChangedSubscriptionVariables
  >(EntityChangedDocument, baseOptions);
}
export const MessageReceivedDocument: DocumentNode = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "MessageReceived" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "channel" }
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          },
          directives: []
        }
      ],
      directives: [],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "messageReceived" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "channel" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "channel" }
                }
              }
            ],
            directives: [],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "author" },
                  arguments: [],
                  directives: []
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "text" },
                  arguments: [],
                  directives: []
                }
              ]
            }
          }
        ]
      }
    }
  ]
};

export const MessageReceivedComponent = (
  props: Omit<
    Omit<
      ReactApollo.SubscriptionProps<
        MessageReceivedSubscription,
        MessageReceivedSubscriptionVariables
      >,
      "subscription"
    >,
    "variables"
  > & { variables?: MessageReceivedSubscriptionVariables }
) => (
  <ReactApollo.Subscription<
    MessageReceivedSubscription,
    MessageReceivedSubscriptionVariables
  >
    subscription={MessageReceivedDocument}
    {...props}
  />
);

export function useMessageReceivedSubscription(
  baseOptions?: ReactApolloHooks.SubscriptionHookOptions<
    MessageReceivedSubscription,
    MessageReceivedSubscriptionVariables
  >
) {
  return ReactApolloHooks.useSubscription<
    MessageReceivedSubscription,
    MessageReceivedSubscriptionVariables
  >(MessageReceivedDocument, baseOptions);
}
export const MoveDocument: DocumentNode = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Move" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "direction" }
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Direction" }
            }
          },
          directives: []
        }
      ],
      directives: [],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "move" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "direction" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "direction" }
                }
              }
            ],
            directives: [],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "x" },
                  arguments: [],
                  directives: []
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "y" },
                  arguments: [],
                  directives: []
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
export type MoveMutationFn = ReactApollo.MutationFn<
  MoveMutation,
  MoveMutationVariables
>;

export const MoveComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<MoveMutation, MoveMutationVariables>,
      "mutation"
    >,
    "variables"
  > & { variables?: MoveMutationVariables }
) => (
  <ReactApollo.Mutation<MoveMutation, MoveMutationVariables>
    mutation={MoveDocument}
    {...props}
  />
);

export function useMoveMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    MoveMutation,
    MoveMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<MoveMutation, MoveMutationVariables>(
    MoveDocument,
    baseOptions
  );
}
export const SendMessageDocument: DocumentNode = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SendMessage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "channel" }
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          },
          directives: []
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "message" }
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
          },
          directives: []
        }
      ],
      directives: [],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sendMessage" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "channel" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "channel" }
                }
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "message" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "message" }
                }
              }
            ],
            directives: [],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "text" },
                  arguments: [],
                  directives: []
                }
              ]
            }
          }
        ]
      }
    }
  ]
};
export type SendMessageMutationFn = ReactApollo.MutationFn<
  SendMessageMutation,
  SendMessageMutationVariables
>;

export const SendMessageComponent = (
  props: Omit<
    Omit<
      ReactApollo.MutationProps<
        SendMessageMutation,
        SendMessageMutationVariables
      >,
      "mutation"
    >,
    "variables"
  > & { variables?: SendMessageMutationVariables }
) => (
  <ReactApollo.Mutation<SendMessageMutation, SendMessageMutationVariables>
    mutation={SendMessageDocument}
    {...props}
  />
);

export function useSendMessageMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    SendMessageMutation,
    SendMessageMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    SendMessageMutation,
    SendMessageMutationVariables
  >(SendMessageDocument, baseOptions);
}
