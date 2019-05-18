import { gql } from "apollo-server";
import { withFilter } from "apollo-server";

import { withInitialValue } from "../util/with-initial-value";
import { Resolvers, Entity, Direction, Position } from "../generated/graphql";
import { EntityDbObject, RoomDoc } from "../types/db-types";
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
      subscribe: withInitialValue(
        withFilter(
          () => pubSub.asyncIterator<Entity>(ENTITY_MOVE),
          (payload, variables) => payload.id === variables.id
        ),
        (_root, { id }, context) =>
          context.store.entities.findOne({ id: { $eq: id } }).exec()
      ),
      // skip having to do an additional db lookup on id
      resolve(iteratorResult: any) {
        return iteratorResult;
      }
    }
  },
  Mutation: {
    async move(_root, { direction }, context) {
      const { name: username } = context.userData!;

      const { entities } = context.store;

      // TODO: not just the player!
      const entity = await entities.findOne({ id: { $eq: "player" } }).exec();

      if (!entity) {
        console.log(`No entity found for username ${username}`);
        return null;
      }

      const room: RoomDoc = await entity.populate("room");
      const nextPosition = await getNextPosition(entity, room, direction);
      if (
        nextPosition.x !== entity.position.x ||
        nextPosition.y !== entity.position.y
      ) {
        await entity.atomicSet("position", nextPosition);
      }
      return entity.position;
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

export async function canMoveInDirection(
  entity: EntityDbObject,
  room: RoomDoc,
  direction: Direction
): Promise<boolean> {
  let targetX = entity.position.x;
  let targetY = entity.position.y;
  switch (direction) {
    case Direction.Right:
      targetX += 1;
      break;
    case Direction.Down:
      targetY -= 1;
      break;
    case Direction.Left:
      targetX -= 1;
      break;
    case Direction.Up:
      targetY += 1;
      break;
  }

  if (targetX > room.width - 1) return false; // right
  if (targetY < 0) return false; // down
  if (targetX < 0) return false; // left
  if (targetY > room.height - 1) return false; // up

  // incredibly naive hit detection
  const entities: EntityDbObject[] = await room.populate("entities");
  const isBlocked = entities.some(
    e => e.position.x === targetX && e.position.y === targetY
  );

  return !isBlocked;
}

async function getNextPosition(
  entity: EntityDbObject,
  room: RoomDoc,
  direction: Direction
): Promise<Position> {
  const canMove = await canMoveInDirection(entity, room, direction);
  if (!canMove) return entity.position;

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
