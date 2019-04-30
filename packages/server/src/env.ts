import path from "path";
import envalid from "envalid";

const env = envalid.cleanEnv(
  process.env,
  {
    DATA_DIR: envalid.str({
      devDefault: path.resolve(__dirname, "..", "persist")
    }),
    API_HOSTNAME: envalid.str({ devDefault: "localhost" }),
    API_PORT: envalid.num({ devDefault: 4000 })
  },
  { strict: true }
);

export const { DATA_DIR, API_HOSTNAME: HOSTNAME, API_PORT: PORT, isDev } = env;
