import { gql } from "apollo-server";
import { withFilter } from "apollo-server";

import {
  Resolvers,
  Entity,
  Direction,
  Position,
  Room
} from "../generated/graphql";
import { EntityDbObject } from "../types/db-types";
import pubSub from "../pub-sub";

// import { randomName } from "../util/name";

export const ENTITY_JOIN = "ENTITY_JOIN";
export const ENTITY_MOVE = "ENTITY_MOVE";

export const typeDefs = gql`
  extend type Subscription {
    entityChanged(id: String!): Entity!
  }

  extend type Mutation {
    move(direction: Direction!): Position
  }

  extend type Query {
    entity(id: String!): Entity
  }

  type Position {
    x: Int!
    y: Int!
  }

  type Entity {
    id: String!
    name: String!
    description: String!
    room: Room!
    appearance: String!
    color: String!
    position: Position!
  }

  enum Direction {
    UP
    DOWN
    LEFT
    RIGHT
  }
`;

export const resolvers: Resolvers = {
  Subscription: {
    entityChanged: {
      subscribe: withFilter(
        () => pubSub.asyncIterator<Entity>(ENTITY_MOVE),
        (payload, variables) => payload.id === variables.id
      ),
      // skip having to do an additional db lookup on id
      resolve(iteratorResult: any) {
        return iteratorResult;
      }
    }
  },
  Mutation: {
    async move(_root, { direction }, context) {
      const { name: userName } = context.userData!;

      console.log(`${userName} wants to move in direction ${direction}`);

      const { entities } = context.store;

      // TODO: not just the player!
      const entity = await entities.findOne({ id: { $eq: "player" } }).exec();

      if (entity) {
        const room = await entity.populate("room");
        const nextPosition = tryMove(entity, room, direction);
        if (
          nextPosition.x !== entity.position.x ||
          nextPosition.y !== entity.position.y
        ) {
          await entity.atomicSet("position", nextPosition);
        }
        return entity.position;
      }

      return null;
    }
  },
  Query: {
    async entity(_root, { id }, context) {
      return context.store.entities.findOne({ id: { $eq: id } }).exec();
    }
  },
  Entity: {
    async room(parent, _args, _context) {
      return parent.populate("room");
    }
  }
};

// function getRandomDirection(): Direction {
//   const d = Math.random();

//   switch (true) {
//     case d < 0.25:
//       return Direction.Right;
//     case d < 0.5:
//       return Direction.Down;
//     case d < 0.75:
//       return Direction.Left;
//     default:
//       return Direction.Up;
//   }
// }

function canMoveInDirection(
  entity: EntityDbObject,
  room: Room,
  direction: Direction
): boolean {
  switch (direction) {
    case Direction.Right:
      return entity.position.x < room.width - 1;
    case Direction.Down:
      return entity.position.y > 0;
    case Direction.Left:
      return entity.position.x > 0;
    case Direction.Up:
      return entity.position.y < room.height - 1;
  }
}

function tryMove(
  entity: EntityDbObject,
  room: Room,
  direction: Direction
): Position {
  if (!canMoveInDirection(entity, room, direction)) return entity.position;

  const { x, y } = entity.position;

  let deltaX = 0;
  let deltaY = 0;

  switch (direction) {
    case Direction.Right:
      deltaX = 1;
      break;
    case Direction.Down:
      deltaY = -1;
      break;
    case Direction.Left:
      deltaX = -1;
      break;
    case Direction.Up:
      deltaY = 1;
      break;
  }

  return {
    x: x + deltaX,
    y: y + deltaY
  };
}
