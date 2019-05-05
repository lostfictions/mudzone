import path from "path";
import { readJsonSync, outputJsonSync } from "fs-extra";

import { programFromConfig, buildGenerator } from "typescript-json-schema";

const generator = buildGenerator(
  programFromConfig(path.join(__dirname, "tsconfig.json")),
  {
    required: true,
    ignoreErrors: true
  }
);

if (!generator) {
  throw new Error("Failed to generate schema.");
}

const typesToGenerate = readJsonSync(
  path.join(__dirname, "types-to-generate.json")
);

typesToGenerate.forEach((t: string) => {
  outputJsonSync(
    path.join(__dirname, "src/generated", "schemas", `${kebabCase(t)}.json`),
    generator.getSchemaForSymbol(t)
  );
});

console.log("Done generating DB schema files.");

function kebabCase(str: string) {
  return str.replace(
    /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
    match => "-" + match.toLowerCase()
  );
}
