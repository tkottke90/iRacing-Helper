/* eslint-disable prettier/prettier */
import { Request, Response, NextFunction } from 'express';
import { loggerService } from '../services/logger.service';
import { HTTPError } from '../utilities/errors.util';

// Standard Express error middleware function
export function errorMiddleware(error: Error, request: Request, response: Response, next: NextFunction) {
  loggerService.error(error);

  if (error instanceof HTTPError) {
    response
      .status(error.code)
      .json({ message: error.message, details: error.details });
  } else {
    response
      .status(500)
      .json({ message: 'Server Error', details: error.message });
  }
}
