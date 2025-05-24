// Controllers manage HTTP requests coming to the system.  Create
// individual controller files in this directory, import them here
// and then add them to the router setup

import { Application, Router } from 'express';
import { ServerStatusController } from './server-status';
import { iRacingController } from './iracing';
import { MCPController } from './mcp.controller';
import { CarController } from './car.controller';
import { attachController, Controller } from 'express-ts-decorators';

const Routers: Record<string, Array<Controller>> = {
  '/v1': [
    new iRacingController(),
    new ServerStatusController(),
    new MCPController(),
    new CarController()
  ]
};

export default function (app: Application) {
  for (const path in Routers) {
    const router = Router({ mergeParams: true });

    for (const Controller of Routers[path]) {
      attachController(router, Controller);
    }

    app.use(path, router);
  }
}
