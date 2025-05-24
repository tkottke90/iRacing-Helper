import express from 'express';
import { Controller } from '../controller';
import { Errors } from '../utils/error.utils';

/**
 * Registers the function with the controller as a PATCH Request
 * @param path The path to register the request with
 * @param middleware Middleware functions to apply to the request
 */
export function Patch<
  Body extends express.Request['body'] = any,
  Query extends express.Request['query'] = any,
  Params extends express.Request['params'] = any,
  Locals extends express.Response['locals'] = any,
  ResBody = any
>(path: string, middleware: express.RequestHandler[] = []) {
  return function actualDecorator(
    _originalMethod: (
      req: express.Request<Params, ResBody, Body, Query>,
      res: express.Response<ResBody, Locals>,
      next?: express.NextFunction
    ) => void,
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
