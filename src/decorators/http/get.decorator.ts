import express from 'express';

interface RouteConfiguration {
  handlers: any[];
  method: 'get' | 'patch' | 'post' | 'put' | 'delete' | 'options';
}

export class Controller {
  readonly routes: Map<string, RouteConfiguration> = new Map();

  path: string;

  constructor(path: string) {
    this.path = path;
  }

  attach(app: express.Application) {
    this.routes.forEach((routeConfig, path) => {
      app[routeConfig.method](this.path + path, ...routeConfig.handlers);
    });
  }
}

export function Get(path: string, middleware: express.RequestHandler[] = []) {
  return function actualDecorator(
    _originalMethod: (...args: any[]) => any,
    context: ClassMethodDecoratorContext
  ) {
    context.addInitializer(function () {
      if (this instanceof Controller) {
        this.routes.set(path, {
          method: 'get',
          handlers: [...middleware, _originalMethod]
        });
      }
    });
  };
}

export function Post(path: string, middleware: express.RequestHandler[] = []) {
  return function actualDecorator(
    _originalMethod: (...args: any[]) => any,
    context: ClassMethodDecoratorContext
  ) {
    context.addInitializer(function () {
      if (this instanceof Controller) {
        this.routes.set(path, {
          method: 'post',
          handlers: [...middleware, _originalMethod]
        });
      }
    });
  };
}
