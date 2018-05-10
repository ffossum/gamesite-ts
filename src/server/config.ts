import { cleanEnv, port, str, url } from "envalid";

export function getConfig(env: NodeJS.ProcessEnv) {
  return cleanEnv(env, {
    DEEPSTREAM_HOST: url({
      devDefault: "http://localhost:6020",
    }),
    DEEPSTREAM_USERNAME: str({
      devDefault: "secret server username",
    }),
    DEEPSTREAM_PASSWORD: str({
      devDefault: "secret deepstream password",
    }),
    JWT_SECRET: str({
      devDefault: "secret",
    }),
    SERVER_PORT: port({
      devDefault: 3000,
    }),
  });
}
