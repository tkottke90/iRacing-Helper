// Controllers manage HTTP requests coming to the system.  Create
// individual controller files in this directory, import them here
// and then add them to the router setup

import { Application } from 'express';
import { ServerStatusController } from './server-status';
import { iRacingController } from './iracing';
import { MCPController } from './mcp.controller';
import { CarController } from './car.controller';

export default function (app: Application) {
  // Instantiate controllers
  const serverStatusController = new ServerStatusController();
  const iracingController = new iRacingController('/iracing');
  const mcpController = new MCPController();
  const carController = new CarController();

  // Server Status routes
  app.get('/', (req, res) => serverStatusController.getRoot(res));
  app.get('/healthcheck', (req, res) =>
    serverStatusController.getHealthcheck(res)
  );

  // iRacing routes
  iracingController.attach(app);

  // MCP routes
  app.get('/mcp', (req, res) => mcpController.getRoot(res));
  app.get('/mcp/cars', (req, res) => mcpController.getCars(res));
  app.get('/mcp/tracks', (req, res) => mcpController.getTracks(res));

  // Car routes
  app.get('/cars/mcp', (req, res) => carController.getCarsMCP(res));
}
