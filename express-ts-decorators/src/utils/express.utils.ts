import express from 'express';
import { Controller } from '../controller';

export function attachController(app: express.Router, controller: Controller) {
  app.use(controller.path, controller.router);
}
