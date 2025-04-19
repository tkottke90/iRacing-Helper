import express from 'express';
import { LoggerService } from '../services';
import { EnvironmentService } from '../services/environment.service';

const NS_PER_SEC = 1e9;
const NS_TO_MS = 1e6;

const logger = new LoggerService(new EnvironmentService());

export function HttpEventMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const start = process.hrtime();

  res.on('close', () => {
    const diff = process.hrtime(start);
    const duration = (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;

    logger.log('info', `${req.method} ${req.originalUrl} [${duration} ms]`, {
      method: req.method,
      url: req.url,
      timingMS: duration,
      status: res.statusCode
    });
  });

  next();
}
