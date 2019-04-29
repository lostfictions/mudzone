import * as envalid from "envalid";

const env = envalid.cleanEnv(
  process.env,
  {
    API_HOSTNAME: envalid.str({ devDefault: "localhost" }),
    API_PORT: envalid.num({ devDefault: 4000 })
  },
  { strict: true }
);

export const { API_HOSTNAME: HOSTNAME, API_PORT: PORT, isDev } = env;
