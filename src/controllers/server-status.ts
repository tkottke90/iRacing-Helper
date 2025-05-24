import express from 'express';
import pgk from '../../package.json';
import { Controller, Get } from 'express-ts-decorators';

export class ServerStatusController extends Controller {
  constructor(path = '/') {
    super(path);
  }

  @Get('/')
  getRoot(_req: express.Request, res: express.Response) {
    res.json({ version: pgk.version });
  }

  @Get('/healthcheck')
  getHealthcheck(_req: express.Request, res: express.Response) {
    res.json({ status: 'OKAY' });
  }
}
