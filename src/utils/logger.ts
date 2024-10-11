import { format } from 'date-fns';
import winston from 'winston';

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
});

winstonLogger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }),

);

export class Logger {
  message(text: string, level = 'info'): void {
    const { NODE_ENV, LOGGER } = process.env;
    const message = this.addTimestamp(text);

    if (level === 'start' || NODE_ENV?.toUpperCase() !== 'DEV' || LOGGER?.toUpperCase() === 'TRUE') {
      if (level === 'start') {
        level = 'info';
      }

      winstonLogger.log({ level, message });
    }
  }

  addTimestamp(text: string): string {
    const timestamp = format(new Date(), 'yyyy/MM/dd HH:mm:ss');

    return `[${timestamp}] ${text}`;
  }
}