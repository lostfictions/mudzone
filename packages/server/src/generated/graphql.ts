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
  move: Maybe<Position>;
  sendMessage: Maybe<Message>;
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
  room: Maybe<Room>;
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
  channel: Maybe<Scalars["String"]>;
};

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

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
  Room: Room;
  Int: Scalars["Int"];
  Mutation: {};
  Direction: Direction;
  Position: Position;
  Message: Message;
  Subscription: {};
  Entity: Entity;
  Boolean: Scalars["Boolean"];
  CacheControlScope: CacheControlScope;
  Upload: Scalars["Upload"];
};

export type CacheControlDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = {
    maxAge: Maybe<Maybe<Scalars["Int"]>>;
    scope: Maybe<Maybe<CacheControlScope>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Entity"]
> = {
  id: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  appearance: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  color: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  position: Resolver<ResolversTypes["Position"], ParentType, ContextType>;
};

export type MessageResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Message"]
> = {
  channel: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  author: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  text: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Mutation"]
> = {
  move: Resolver<
    Maybe<ResolversTypes["Position"]>,
    ParentType,
    ContextType,
    MutationMoveArgs
  >;
  sendMessage: Resolver<
    Maybe<ResolversTypes["Message"]>,
    ParentType,
    ContextType,
    MutationSendMessageArgs
  >;
};

export type PositionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Position"]
> = {
  x: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  y: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Query"]
> = {
  room: Resolver<
    Maybe<ResolversTypes["Room"]>,
    ParentType,
    ContextType,
    QueryRoomArgs
  >;
};

export type RoomResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Room"]
> = {
  width: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  height: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType = ResolversTypes["Subscription"]
> = {
  entityChanged: SubscriptionResolver<
    ResolversTypes["Entity"],
    ParentType,
    ContextType,
    SubscriptionEntityChangedArgs
  >;
  messageReceived: SubscriptionResolver<
    ResolversTypes["Message"],
    ParentType,
    ContextType,
    SubscriptionMessageReceivedArgs
  >;
};

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Upload"], any> {
  name: "Upload";
}

export type Resolvers<ContextType = any> = {
  Entity: EntityResolvers<ContextType>;
  Message: MessageResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Position: PositionResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Room: RoomResolvers<ContextType>;
  Subscription: SubscriptionResolvers<ContextType>;
  Upload: GraphQLScalarType;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  cacheControl: CacheControlDirectiveResolver<any, any, ContextType>;
};

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<
  ContextType
>;
