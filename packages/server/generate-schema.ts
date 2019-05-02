import { exec } from "child_process";
import { createServer } from "net";

import { ApolloServer } from "apollo-server";
import typeDefs from "./src/types/typedefs";

const configFile = process.argv.slice(2).includes("--client")
  ? "codegen.client.yml"
  : "codegen.server.yml";

function runCodeGen(url: string): Promise<void> {
  return new Promise(res => {
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
}

(async () => {
  const portInUse = await isPortInUse(4000);
  if (portInUse) {
    // assume it's our server (for now!)
    await runCodeGen("http://localhost:4000");
  } else {
    const mockServer = new ApolloServer({
      typeDefs,
      mocks: true
    });

    const { url } = await mockServer.listen();

    console.log(`Listening at ${url}`);

    await runCodeGen(url);

    console.log("Closing server....");
    await mockServer.stop();

    console.log("Done.");
  }
})();

function isPortInUse(port: number): Promise<boolean> {
  return new Promise((res, rej) => {
    const testServer = createServer();

    testServer
      .once("error", (err: any) => {
        if (err.code !== "EADDRINUSE") rej(err);
        res(true);
      })
      .once("listening", () => {
        testServer
          .once("close", () => {
            res(false);
          })
          .close();
      })
      .listen(port);
  });
}
