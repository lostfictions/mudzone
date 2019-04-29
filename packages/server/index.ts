import { ApolloServer, gql, PubSub } from "apollo-server";

import { HOSTNAME, PORT } from "./env";

const pubsub = new PubSub();

const BOOPED = "BOOPED";

setInterval(() => {
  pubsub.publish(BOOPED, { booped: `server: ${Date.now()}` });
}, 5000);

const typeDefs = gql`
  type Subscription {
    booped: String
  }

  type Mutation {
    sendMessage(author: String, message: String): String
  }

  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
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
    sendMessage(_root: any, { author, message }: any, _context: any) {
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
