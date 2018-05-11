import * as winston from "winston";
import { LogLevel } from "./config";

type LogMethod = (msg: string) => void;
type Logger = { [level in LogLevel]: LogMethod };

let instance: Logger = {
  error: _ => undefined,
  warn: _ => undefined,
  info: _ => undefined,
  debug: _ => undefined,
};

export function initLogger(level: LogLevel) {
  instance = new winston.Logger({
    level: level as string,
    transports: [
      new winston.transports.Console({
        colorize: "level",
        timestamp: true,
      }),
    ],
  });
}

const logger: Logger = {
  error(msg: string) {
    instance.error(msg);
  },
  warn(msg: string) {
    instance.warn(msg);
  },
  info(msg: string) {
    instance.info(msg);
  },
  debug(msg: string) {
    instance.debug(msg);
  },
};

export default logger;
