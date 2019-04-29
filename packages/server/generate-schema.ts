import { exec } from "child_process";

import { ApolloServer } from "apollo-server";

import typeDefs from "./src/typedefs";

const configFile = process.argv.slice(2).includes("--client")
  ? "codegen.client.yml"
  : "codegen.server.yml";

const mockServer = new ApolloServer({
  typeDefs,
  mocks: true
});

mockServer.listen().then(async ({ url, server }) => {
  console.log(`Listening at ${url}`);

  await new Promise(res => {
    const child = exec(`graphql-codegen --config ${configFile}`, {
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
