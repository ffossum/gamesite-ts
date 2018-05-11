import { cleanEnv, makeValidator, port, str, url } from "envalid";

export enum LogLevel {
  error = "error",
  warn = "warn",
  info = "info",
  debug = "debug",
}

const logLevel = makeValidator<LogLevel>(input => {
  const level = LogLevel[input as any];
  if (level) {
    return level;
  } else {
    throw new Error(`Invalid log level ${input}. Must be one of ${Object.values(LogLevel)}`);
  }
});

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
    LOG_LEVEL: logLevel({
      choices: Object.values(LogLevel),
      default: LogLevel.info,
      devDefault: LogLevel.debug,
    }),
    SERVER_PORT: port({
      devDefault: 3000,
    }),
  });
}
