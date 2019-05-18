export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
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
  name: Scalars["String"];
  description: Scalars["String"];
  room: Room;
  appearance: Scalars["String"];
  color: Scalars["String"];
  position: Position;
};

export type Message = {
  id: Scalars["String"];
  time: Scalars["String"];
  channel: Scalars["String"];
  author: Scalars["String"];
  text: Scalars["String"];
};

export type Mutation = {
  _empty?: Maybe<Scalars["String"]>;
  sendMessage?: Maybe<Message>;
  move?: Maybe<Position>;
};

export type MutationSendMessageArgs = {
  channel: Scalars["String"];
  message: Scalars["String"];
};

export type MutationMoveArgs = {
  direction: Direction;
};

export type Position = {
  x: Scalars["Int"];
  y: Scalars["Int"];
};

export type Query = {
  _empty?: Maybe<Scalars["String"]>;
  message?: Maybe<Message>;
  messages?: Maybe<Array<Message>>;
  entity?: Maybe<Entity>;
  room?: Maybe<Room>;
};

export type QueryMessageArgs = {
  id: Scalars["String"];
};

export type QueryMessagesArgs = {
  channel: Scalars["String"];
};

export type QueryEntityArgs = {
  id: Scalars["String"];
};

export type QueryRoomArgs = {
  id: Scalars["String"];
};

export type Room = {
  id: Scalars["String"];
  name: Scalars["String"];
  width: Scalars["Int"];
  height: Scalars["Int"];
  entities: Array<Entity>;
};

export type RoomChange = {
  name?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["Int"]>;
  height?: Maybe<Scalars["Int"]>;
  joined?: Maybe<Array<Entity>>;
  left?: Maybe<Array<Entity>>;
};

export type Subscription = {
  _empty?: Maybe<Scalars["String"]>;
  messageReceived: Message;
  entityChanged: Entity;
  roomChanged: RoomChange;
};

export type SubscriptionMessageReceivedArgs = {
  channel?: Maybe<Scalars["String"]>;
};

export type SubscriptionEntityChangedArgs = {
  id: Scalars["String"];
};

export type SubscriptionRoomChangedArgs = {
  id: Scalars["String"];
};

import { EntityDoc, RoomDoc } from "../types/db-types";
import { ResolverContext } from "../types/resolver-context";

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type Resolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: {};
  String: Scalars["String"];
  Message: Message;
  Entity: EntityDoc;
  Room: RoomDoc;
  Int: Scalars["Int"];
  Position: Position;
  Mutation: {};
  Direction: Direction;
  Subscription: {};
  RoomChange: Omit<RoomChange, "joined" | "left"> & {
    joined?: Maybe<Array<ResolversTypes["Entity"]>>;
    left?: Maybe<Array<ResolversTypes["Entity"]>>;
  };
  Boolean: Scalars["Boolean"];
  CacheControlScope: CacheControlScope;
  DateTime: Scalars["DateTime"];
  Upload: Scalars["Upload"];
};

export type CacheControlDirectiveResolver<
  Result,
  Parent,
  ContextType = ResolverContext,
  Args = {
    maxAge?: Maybe<Maybe<Scalars["Int"]>>;
    scope?: Maybe<Maybe<CacheControlScope>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type EntityResolvers<
  ContextType = ResolverContext,
  ParentType = ResolversTypes["Entity"]
> = {
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  room?: Resolver<ResolversTypes["Room"], ParentType, ContextType>;
  appearance?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  color?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  position?: Resolver<ResolversTypes["Position"], ParentType, ContextType>;
};

export type MessageResolvers<
  ContextType = ResolverContext,
  ParentType = ResolversTypes["Message"]
> = {
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  time?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  channel?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  author?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  text?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = ResolverContext,
  ParentType = ResolversTypes["Mutation"]
> = {
  _empty?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  sendMessage?: Resolver<
    Maybe<ResolversTypes["Message"]>,
    ParentType,
    ContextType,
    MutationSendMessageArgs
  >;
  move?: Resolver<
    Maybe<ResolversTypes["Position"]>,
    ParentType,
    ContextType,
    MutationMoveArgs
  >;
};

export type PositionResolvers<
  ContextType = ResolverContext,
  ParentType = ResolversTypes["Position"]
> = {
  x?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  y?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = ResolverContext,
  ParentType = ResolversTypes["Query"]
> = {
  _empty?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  message?: Resolver<
    Maybe<ResolversTypes["Message"]>,
    ParentType,
    ContextType,
    QueryMessageArgs
  >;
  messages?: Resolver<
    Maybe<Array<ResolversTypes["Message"]>>,
    ParentType,
    ContextType,
    QueryMessagesArgs
  >;
  entity?: Resolver<
    Maybe<ResolversTypes["Entity"]>,
    ParentType,
    ContextType,
    QueryEntityArgs
  >;
  room?: Resolver<
    Maybe<ResolversTypes["Room"]>,
    ParentType,
    ContextType,
    QueryRoomArgs
  >;
};

export type RoomResolvers<
  ContextType = ResolverContext,
  ParentType = ResolversTypes["Room"]
> = {
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  width?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  height?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  entities?: Resolver<Array<ResolversTypes["Entity"]>, ParentType, ContextType>;
};

export type RoomChangeResolvers<
  ContextType = ResolverContext,
  ParentType = ResolversTypes["RoomChange"]
> = {
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  height?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  joined?: Resolver<
    Maybe<Array<ResolversTypes["Entity"]>>,
    ParentType,
    ContextType
  >;
  left?: Resolver<
    Maybe<Array<ResolversTypes["Entity"]>>,
    ParentType,
    ContextType
  >;
};

export type SubscriptionResolvers<
  ContextType = ResolverContext,
  ParentType = ResolversTypes["Subscription"]
> = {
  _empty?: SubscriptionResolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  messageReceived?: SubscriptionResolver<
    ResolversTypes["Message"],
    ParentType,
    ContextType,
    SubscriptionMessageReceivedArgs
  >;
  entityChanged?: SubscriptionResolver<
    ResolversTypes["Entity"],
    ParentType,
    ContextType,
    SubscriptionEntityChangedArgs
  >;
  roomChanged?: SubscriptionResolver<
    ResolversTypes["RoomChange"],
    ParentType,
    ContextType,
    SubscriptionRoomChangedArgs
  >;
};

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Upload"], any> {
  name: "Upload";
}

export type Resolvers<ContextType = ResolverContext> = {
  DateTime?: GraphQLScalarType;
  Entity?: EntityResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Position?: PositionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Room?: RoomResolvers<ContextType>;
  RoomChange?: RoomChangeResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ResolverContext> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = ResolverContext> = {
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
};

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<
  ContextType = ResolverContext
> = DirectiveResolvers<ContextType>;
