import express from 'express';
import { Controller, Get, Response } from '@decorators/express';
import { Inject } from '@decorators/di';
import { iRacingService } from '../services/iracing.service';
import { TrackDao } from '../dao/track.dao';
import { CarDao } from '../dao/car.dao';
import { LoggerService } from '../services';

@Controller('/iracing')
export class iRacingController {
  constructor(
    @Inject('LoggerService') private readonly logger: LoggerService,
    @Inject('iRacingService') private readonly iRacingService: iRacingService,
    @Inject('TrackDao') private readonly trackDao: TrackDao,
    @Inject('CarDao') private readonly carDao: CarDao
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

  @Get('/sync/cars')
  async syncCars(@Response() res: express.Response) {
    try {
      const cars = await this.iRacingService.getAllCars();

      const syncedCars = [];
      const errors: Array<{ car: string; error: Error }> = [];

      for (const car of cars) {
        syncedCars.push(
          await this.carDao.createFromIRacing(car).catch((error) => {
            this.logger.error(error);
            errors.push({
              car: car.car_name ?? 'MISSING',
              error
            });
          })
        );
      }

      res.json({
        results: {
          total: cars.length,
          synced: syncedCars.length,
          failed: errors.length
        },
        errors,
        syncedCars
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  @Get('/sync/tracks')
  async syncTracks(@Response() res: express.Response) {
    try {
      const tracks = await this.iRacingService.getAllTracks();

      const syncedTracks = [];
      const errors: Array<{ track: string; config: string; error: Error }> = [];

      for (const track of tracks) {
        syncedTracks.push(
          await this.trackDao.createFromIRacing(track).catch((error) => {
            this.logger.error(error);
            errors.push({
              track: track.track_name ?? 'MISSING',
              config: track.config_name ?? 'MISSING',
              error
            });
          })
        );
      }

      res.json({
        results: {
          total: tracks.length,
          synced: syncedTracks.length,
          failed: errors.length
        },
        errors,
        syncedTracks
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
}
