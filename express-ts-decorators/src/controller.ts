import express from 'express';

interface RouteConfiguration {
  handlers: express.RequestHandler[];
  method: keyof Pick<
    express.Router,
    'get' | 'patch' | 'post' | 'put' | 'delete' | 'options'
  >;
}

export class Controller {
  readonly routes: Map<string, RouteConfiguration> = new Map();
  readonly router: express.Router;

  constructor(
    readonly path: string,
    readonly middleware: express.RequestHandler[] = []
  ) {
    this.router = express.Router({ mergeParams: true });
  }

  register(app: express.Application) {
    this.routes.forEach((routeConfig, path) => {
      this.router[routeConfig.method](
        this.path + path,
        ...this.middleware,
        ...routeConfig.handlers
      );
    });

    app.use(this.path, this.router);
  }
}
