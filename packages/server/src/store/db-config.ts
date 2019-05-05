import RxDB from "rxdb/plugins/core";

import { isDev } from "../env";

// we want max perf in production...
if (isDev) {
  ["rxdb/plugins/ajv-validate", "rxdb/plugins/schema-check"].forEach(p =>
    RxDB.plugin(require(p))
  );
} else {
  ["rxdb/plugins/no-validate"].forEach(p => RxDB.plugin(require(p)));
}

[
  "pouchdb-adapter-memory",
  "rxdb/plugins/error-messages",
  "rxdb/plugins/in-memory",
  "rxdb/plugins/local-documents"
].forEach(p => RxDB.plugin(require(p)));

export default RxDB;
