import { ApolloServer } from "apollo-server";
import { ConnectionContext } from "subscriptions-transport-ws";
import WebSocket from "ws";
import { DateTime } from "@okgrow/graphql-scalars";
import merge from "lodash.merge";

import { randomName } from "./util/name";
import { HOSTNAME, PORT, DATA_DIR } from "./env";

import typeDefs from "./types/all-typedefs";
import { ResolverContext, UserData } from "./resolver-context";
import pubSub from "./pub-sub";

import { resolvers as MessageResolvers } from "./types/messages";
import { resolvers as EntityResolvers } from "./types/entities";
import { resolvers as RoomResolvers } from "./types/rooms";

import { getStore } from "./store/store";
import { initSideEffects } from "./store/side-effects";
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
    resolvers: merge(
      { DateTime },
      MessageResolvers,
      EntityResolvers,
      RoomResolvers
    ),
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
        store,
        pubSub
      };
    }
  });

  const { url, subscriptionsUrl } = await server.listen(PORT, HOSTNAME);

  console.log(`🚀 Server ready at ${url}!`);
  console.log(`🚀 Subscriptions available at ${subscriptionsUrl}!`);

  initSideEffects(store);
})();
