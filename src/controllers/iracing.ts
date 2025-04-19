import express from 'express';
import { Controller, Get, Response } from '@decorators/express';
import { Inject } from '@decorators/di';
import { iRacingService } from '../services/iracing.service';

@Controller('/iracing')
export class iRacingController {
  constructor(
    @Inject('iRacingService') private readonly iRacingService: iRacingService
  ) {}

  @Get('/cars')
  async getCars(@Response() res: express.Response) {
    try {
      const cars = await this.iRacingService.getAllCars();
      res.json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  @Get('/car-classes')
  async getCarClasses(@Response() res: express.Response) {
    try {
      const carClasses = await this.iRacingService.getAllCarClasses();
      res.json(carClasses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  @Get('/tracks')
  async getRoot(@Response() res: express.Response) {
    try {
      const tracks = await this.iRacingService.getAllTracks();
      res.json(tracks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
}
