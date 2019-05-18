import { ApolloServer } from "apollo-server";
import { ConnectionContext } from "subscriptions-transport-ws";
import WebSocket from "ws";
import uuid from "uuid/v4";
import randomColor from "randomcolor";

import { typeDefs, resolvers } from "./gql";
import { randomName } from "./util/name";
import { HOSTNAME, PORT, DATA_DIR } from "./env";
import { getStore } from "./store/store";
import { initSideEffects } from "./store/side-effects";

// ts types
import { ResolverContext, UserData } from "./types/resolver-context";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

const getAddress = (context: ConnectionContext): string => {
  const addressOrString = context.request.socket.address();
  if (typeof addressOrString === "string") {
    return addressOrString;
  }
  return `${addressOrString.address}:${addressOrString.port}`;
};

const connections = new Map<WebSocket, UserData>();

(async () => {
  const store = await getStore(DATA_DIR);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
      async onConnect(_connectionParams, webSocket, context) {
        const address = getAddress(context);
        if (connections.has(webSocket)) {
          throw new Error(
            `Client connecting, but already exists! (${address})`
          );
        }

        const id = uuid();
        const name = randomName();
        console.log(`Client connected! ${name} (${address})`);
        const player = await store.entities.insert({
          id,
          name,
          description: "despite everything, it's still you.",
          room: "default",
          position: { x: 5, y: 5 }, // FIXME
          appearance: "@",
          color: randomColor() as string
        });

        const room = await store.rooms
          .findOne({ id: { $eq: "default" } })
          .exec();
        if (!room) {
          throw new Error("Room not found");
        }
        room.atomicSet("entities", room.entities.concat(id));

        connections.set(webSocket, { id, name, address });

        return { socket: webSocket, player };
      },
      async onDisconnect(webSocket, _context) {
        const connection = connections.get(webSocket);
        if (!connection) {
          console.warn(
            `Client disconnecting, but not found in connection map!`,
            webSocket
          );
          return;
        }

        const { id, name } = connection;

        const room = await store.rooms
          .findOne({ id: { $eq: "default" } })
          .exec();
        if (!room) {
          throw new Error("Room not found");
        }
        room.atomicSet("entities", room.entities.filter(_id => _id !== id));

        const player = await store.entities.findOne({ id: { $eq: id } }).exec();
        if (!player) {
          throw new Error(
            `Disconnecting: entity not found for player "${name}"`
          );
        }
        await player.remove();

        console.log(
          `Client disconnected! ${connection.name} (${connection.address})`
        );

        connections.delete(webSocket);
      }
    },
    context: (
      connectionMetadata: ExpressContext & {
        connection?: { context: ConnectionContext };
      }
    ): ResolverContext | null => {
      let userData: UserData | undefined;
      if (connectionMetadata.connection) {
        userData = connections.get(
          connectionMetadata.connection.context.socket
        );
        if (!userData) {
          console.warn("No user data available for socket connection!");
        }
      } else {
        console.warn(
          "Non-WS connection made to server! Cannot provide user data as context."
        );
      }

      return {
        userData,
        store
      };
    }
  });

  const { url, subscriptionsUrl } = await server.listen(PORT, HOSTNAME);

  console.log(`🚀 Server ready at ${url}!`);
  console.log(`🚀 Subscriptions available at ${subscriptionsUrl}!`);

  initSideEffects(store);
})();
