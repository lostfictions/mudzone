import { join } from "path";
import { readJsonSync, outputJsonSync } from "fs-extra";

import { programFromConfig, buildGenerator } from "typescript-json-schema";

const generator = buildGenerator(
  programFromConfig(join(__dirname, "tsconfig.json")),
  {
    required: true,
    ignoreErrors: true,
    uniqueNames: true
  }
);

if (!generator) {
  throw new Error("Failed to generate schema.");
}

const typesToGenerate = readJsonSync(join(__dirname, "types-to-generate.json"));

typesToGenerate.forEach((t: string) => {
  outputJsonSync(
    join(__dirname, "schemas", `${kebabCase(t)}.json`),
    generator.getSchemaForSymbol(
      generator
        .getSymbols(t)
        // in the case of conflicts for a type name like "Message", prefer
        // something we defined ourselves.
        .find(s => !s.fullyQualifiedName.includes("node_modules"))!.name
    ),
    { spaces: 2 }
  );
});

console.log("Done generating DB schema files.");

function kebabCase(str: string) {
  return str.replace(
    /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
    (match, offset) => (offset > 0 ? "-" : "") + match.toLowerCase()
  );
}
