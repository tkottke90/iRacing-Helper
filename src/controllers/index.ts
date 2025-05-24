// Controllers manage HTTP requests coming to the system.  Create
// individual controller files in this directory, import them here
// and then add them to the router setup

import { Application } from 'express';
import { ServerStatusController } from './server-status';
import { iRacingController } from './iracing';
import { MCPController } from './mcp.controller';
import { CarController } from './car.controller';
import { attachVersionMap, createVersionMap } from 'express-ts-decorators';

const VersionMap = createVersionMap([
  new iRacingController(),
  new ServerStatusController(),
  new MCPController(),
  new CarController()
]);

export default function (app: Application) {
  attachVersionMap(app, VersionMap);
}
