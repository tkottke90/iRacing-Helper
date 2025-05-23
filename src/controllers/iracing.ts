import express from 'express';
import { iRacingService, loggerService } from '../services';
import { trackDao } from '../dao/track.dao';
import { carDao } from '../dao/car.dao';
import { Controller, Get } from '../decorators/http/get.decorator';

export class iRacingController extends Controller {
  private readonly logger = loggerService;
  private readonly iRacingService = iRacingService;
  private readonly trackDao = trackDao;
  private readonly carDao = carDao;

  @Get('/car-classes')
  async getRoot(req: express.Request, res: express.Response) {
    res.json({
      description: 'Calls the iRacing API and returns data',
      links: {
        cars: '/iracing/cars',
        carClasses: '/iracing/car-classes',
        tracks: '/iracing/tracks'
      }
    });
  }

  async getCars(res: express.Response) {
    try {
      const cars = await this.iRacingService.getAllCars();
      res.json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  async getCarClasses(res: express.Response) {
    try {
      const carClasses = await this.iRacingService.getAllCarClasses();
      res.json(carClasses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  async getTracks(res: express.Response) {
    try {
      const tracks = await this.iRacingService.getAllTracks();
      res.json(tracks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  async syncCars(res: express.Response) {
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

  async syncTracks(res: express.Response) {
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
