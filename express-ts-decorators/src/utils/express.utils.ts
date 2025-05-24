import express from 'express';
import { Controller } from '../controller';

export function attachController(
  app: express.Application,
  controller: Controller
) {
  app.use(controller.path, controller.router);
}
