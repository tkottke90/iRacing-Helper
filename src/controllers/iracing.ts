import express from 'express';
import { Controller, Get, Response } from '@decorators/express';
import { Inject } from '@decorators/di';
import { iRacingService } from '../services/iracing.service';
import { TrackDao } from '../dao/track.dao';
import { LoggerService } from '../services';

@Controller('/iracing')
export class iRacingController {
  constructor(
    @Inject('LoggerService') private readonly logger: LoggerService,
    @Inject('iRacingService') private readonly iRacingService: iRacingService,
    @Inject('TrackDao') private readonly trackDao: TrackDao
  ) {}

  @Get('/')
  async getRoot(@Response() res: express.Response) {
    res.json({
      description: 'Calls the iRacing API and returns data',
      links: {
        cars: '/iracing/cars',
        carClasses: '/iracing/car-classes',
        tracks: '/iracing/tracks'
      }
    });
  }

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
  async getTracks(@Response() res: express.Response) {
    try {
      const tracks = await this.iRacingService.getAllTracks();
      res.json(tracks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  @Get('/sync/tracks')
  async syncTracks(@Response() res: express.Response) {
    try {
      const tracks = await this.iRacingService.getAllTracks();

      for (const track of tracks) {
        await this.trackDao.createFromIRacing(track).catch((error) => {
          this.logger.error(error);
        });
      }

      res.json(tracks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
}
