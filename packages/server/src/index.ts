import { ApolloServer, PubSub, withFilter } from "apollo-server";
import { ConnectionContext } from "subscriptions-transport-ws";
import WebSocket from "ws";

import { randomName } from "./util/name";
import { HOSTNAME, PORT } from "./env";
import typeDefs from "./typedefs";
import {
  Message,
  Resolvers,
  Entity,
  Room,
  Direction
} from "./generated/graphql";

const pubsub = new PubSub();

const ENTITY_MOVE = "ENTITY_MOVE";
const CHAT_MESSAGE = "CHAT_MESSAGE";

const room: Room = {
  width: 25,
  height: 20
};

const entities: { [id: string]: Entity } = {
  player: {
    id: "player",
    position: { x: 5, y: 5 },
    appearance: "@",
    color: "red"
  },
  npc: {
    id: "npc",
    position: { x: 2, y: 2 },
    appearance: "@",
    color: "blue"
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

function canMoveInDirection(entity: Entity, direction: Direction): boolean {
  switch (direction) {
    case Direction.Right:
      return entity.position.x < room.width;
    case Direction.Down:
      return entity.position.y > 0;
    case Direction.Left:
      return entity.position.x > 0;
    case Direction.Up:
      return entity.position.y < room.height;
  }
}

function tryMove(entity: Entity, direction: Direction): void {
  if (!canMoveInDirection(entity, direction)) return;

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

  entity.position = {
    x: x + deltaX,
    y: y + deltaY
  };

  pubsub.publish(ENTITY_MOVE, entity);
}

setInterval(() => {
  const { x, y } = entities.npc.position;

  const direction = Math.random();

  let deltaX = 0;
  let deltaY = 0;

  /* eslint-disable no-fallthrough */
  switch (true) {
    case direction < 0.25 && x < room.width:
      deltaX = 1;
    case direction < 0.5 && y > 0:
      deltaY = -1;
    case direction < 0.75 && x > 0:
      deltaX = -1;
    case direction < 1 && y < room.height:
      deltaY = 1;
  }
  /* eslint-enable no-fallthrough */

  if (deltaX === 0 && deltaY === 0) {
    return;
  }

  entities.npc.position = {
    x: x + deltaX,
    y: y + deltaY
  };

  pubsub.publish(ENTITY_MOVE, entities.npc);
}, 5000);

setInterval(() => {
  pubsub.publish(CHAT_MESSAGE, {
    channel: "default",
    text: `hi from the server ${new Date().getSeconds()}`,
    author: "server"
  });
}, 5000);

// A map of functions which return data for the schema.
const resolvers: Resolvers = {
  Subscription: {
    entityChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator<Entity>(ENTITY_MOVE),
        (payload, variables) => payload.id === variables.id
      )
    },
    messageReceived: {
      subscribe: withFilter(
        () => pubsub.asyncIterator<Message>(CHAT_MESSAGE),
        (payload, variables) => payload.channel === variables.channel
      ),
      // i don't understand why this is necessary or why it doesn't typecheck
      resolve(iteratorResult: any) {
        return iteratorResult;
      }
    }
  },
  Query: {
    room(_parent, { id }, _context, _info) {
      console.log(id);
      return room;
    }
  },
  Mutation: {
    move(_root, { direction }, context: ConnectionContext) {
      const data = connections.get(context.socket);
      if (!data) {
        console.warn("No connection found for socket request!");
        return null;
      }

      console.log(`${data.name} wants to move ${direction}`);

      tryMove(entities.player, direction);
      return entities.player.position;
    },
    sendMessage(_root, { message: text, channel }, context: ConnectionContext) {
      const data = connections.get(context.socket);
      if (!data) {
        console.error("No connection found for socket request!");
        return null;
      }

      console.log(`[#${channel}] ${data.name}: ${text}`);

      const message = {
        author: data.name,
        channel,
        text
      };

      pubsub.publish(CHAT_MESSAGE, message);
      return message;
    }
  },
  Entity: undefined as any,
  Message: undefined as any,
  Position: undefined as any,
  Room: undefined as any,
  Upload: undefined as any
};

// TODO: fixme
delete resolvers["Entity"];
delete resolvers["Message"];
delete resolvers["Position"];
delete resolvers["Room"];
delete resolvers["Upload"];

const getAddress = (context: ConnectionContext): string => {
  const addressOrString = context.request.socket.address();
  if (typeof addressOrString === "string") {
    return addressOrString;
  }
  return `${addressOrString.address}:${addressOrString.port}`;
};

const connections = new Map<WebSocket, { name: string; address: string }>();

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  subscriptions: {
    onConnect: (_connectionParams, webSocket, context) => {
      const address = getAddress(context);
      if (connections.has(webSocket)) {
        console.warn(`Client connecting, but already exists! (${address})`);
      } else {
        const name = randomName();
        console.log(`Client connected! ${name} (${address})`);
        connections.set(webSocket, { name, address });
      }

      return { socket: webSocket };
    },
    onDisconnect: (webSocket, _context) => {
      const connection = connections.get(webSocket);
      if (!connection) {
        console.warn(
          `Client disconnecting, but not found in connection map!`,
          webSocket
        );
        return;
      }

      console.log(
        `Client disconnected! ${connection.name} (${connection.address})`
      );
      connections.delete(webSocket);
    }
  },
  context: async connectionMetadata => {
    if ((connectionMetadata as any).connection) {
      return (connectionMetadata as any).connection.context;
    } else {
      const { req } = connectionMetadata;
      return { req };
    }
  }
});

server.listen(PORT, HOSTNAME).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}!`);
  console.log(`🚀 Subscriptions available at ${subscriptionsUrl}!`);
});
