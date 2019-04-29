import { exec } from "child_process";

import { ApolloServer } from "apollo-server";

import typeDefs from "./src/typedefs";

const mockServer = new ApolloServer({
  typeDefs,
  mocks: true
});

mockServer.listen().then(async ({ url, server }) => {
  console.log(`Listening at ${url}`);

  await new Promise(res => {
    const child = exec(`graphql-codegen --config codegen.yml`, {
      env: {
        ...process.env,
        URL: url
      }
    });

    child.stdout!.on("data", data => {
      process.stdout.write(data);
    });

    child.stderr!.on("data", data => {
      process.stdout.write(data);
    });

    child.on("exit", res);
  });

  console.log("Closing server....");

  await new Promise((res, rej) =>
    server.close(err => {
      if (err) rej(err);
      else res();
    })
  );

  console.log("Done.");
});
