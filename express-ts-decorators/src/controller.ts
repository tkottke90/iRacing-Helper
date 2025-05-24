import express from 'express';

interface RouteConfiguration {
  handlers: any[];
  method: keyof Pick<
    express.Router,
    'get' | 'patch' | 'post' | 'put' | 'delete' | 'options'
  >;
}

export class Controller {
  readonly routes: Map<string, RouteConfiguration> = new Map();
  readonly router: express.Router;
  readonly path: string;

  constructor(path: string) {
    this.path = path;
    this.router = express.Router({ mergeParams: true });
  }

  register(app: express.Application) {
    this.routes.forEach((routeConfig, path) => {
      this.router[routeConfig.method](
        this.path + path,
        ...routeConfig.handlers
      );
    });

    app.use(this.path, this.router);
  }
}
