import { ApolloServer, PubSub } from "apollo-server";

import { HOSTNAME, PORT } from "./env";
import typeDefs from "./typedefs";
import { Resolvers } from "./generated/graphql";

const pubsub = new PubSub();

const BOOPED = "BOOPED";

setInterval(() => {
  pubsub.publish(BOOPED, { booped: `server: ${Date.now()}` });
}, 5000);

// A map of functions which return data for the schema.
const resolvers: Resolvers = {
  Subscription: {
    booped: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([BOOPED])
    }
  },
  Query: {
    hello: () => "world"
  },
  Mutation: {
    sendMessage(_root, { author, message }, _context) {
      const msg = `${author}: ${message}`;
      console.log(msg);
      pubsub.publish(BOOPED, { booped: msg });
      return msg;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen(PORT, HOSTNAME).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}!`);
  console.log(`🚀 Subscriptions available at ${subscriptionsUrl}!`);
});
