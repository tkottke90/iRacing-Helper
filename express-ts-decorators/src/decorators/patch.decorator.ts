import express from 'express';
import { Controller } from '../controller';
import { Errors } from '../utils/error.utils';

/**
 * Registers the function with the controller as a PATCH Request
 * @param path The path to register the request with
 * @param middleware Middleware functions to apply to the request
 */
export function Patch<
  Request = express.Request,
  Response = express.Response,
  Next = express.NextFunction
>(path: string, middleware: express.RequestHandler[] = []) {
  return function actualDecorator(
    _originalMethod: (...args: any[]) => any,
    context: ClassMethodDecoratorContext
  ) {
    // Register the route to the controller during initialization
    context.addInitializer(function () {
      if (this instanceof Controller) {
        this.router.patch(path, ...middleware, _originalMethod);
      } else {
        // We should display an error here
        console.warn(Errors.InvalidClass);
      }
    });
  };
}
