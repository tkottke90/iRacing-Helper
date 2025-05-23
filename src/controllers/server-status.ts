import express from 'express';
import pgk from '../../package.json';

export class ServerStatusController {
  getRoot(res: express.Response) {
    res.json({ version: pgk.version });
  }

  getHealthcheck(res: express.Response) {
    res.json({ status: 'OKAY' });
  }
}
