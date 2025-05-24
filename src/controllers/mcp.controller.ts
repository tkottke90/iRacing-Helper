import express from 'express';
import { loggerService, mcpService } from '../services';
import { trackDao } from '../dao/track.dao';
import { carDao } from '../dao/car.dao';
import { Controller, Get } from 'express-ts-decorators';

export class MCPController extends Controller {
  private readonly logger = loggerService;
  private readonly mcpService = mcpService;
  private readonly trackDao = trackDao;
  private readonly carDao = carDao;

  constructor(path = '/mcp') {
    super(path);
  }

  @Get('/')
  async getRoot(_req: express.Request, res: express.Response) {
    this.logger.log('debug', 'MCP root endpoint called');

    // Return links to available resources
    res.status(200).json({
      description: 'Model Context Protocol API for iRacing data',
      version: '1.0.0',
      links: {
        cars: '/mcp/cars',
        tracks: '/mcp/tracks',
        carsWithProperties: '/cars/mcp'
      }
    });
  }

  @Get('/cars')
  async getCars(_req: express.Request, res: express.Response) {
    try {
      this.logger.log('debug', 'MCP cars endpoint called');

      // Get cars from database using the CarDao
      const cars = await this.carDao.getAllCars();

      // Create MCP resource
      const mcpResource = this.mcpService.createResource(
        cars,
        {
          type: 'Car',
          description: 'iRacing car data',
          version: '1.0.0',
          properties: {
            id: 'Unique identifier for the car',
            car_name: 'Full name of the car',
            car_id: 'iRacing ID for the car',
            price: 'Price of the car',
            price_display: 'Formatted price display string',
            has_headlights: 'Whether the car has headlights',
            free_with_subscription: 'Whether the car is free with subscription'
          }
        },
        [
          {
            description: 'Get all cars',
            rel: 'self',
            href: '/mcp/cars'
          },
          {
            description: 'Get car by ID',
            rel: 'item',
            href: '/mcp/cars/{id}'
          }
        ]
      );

      res.status(200).json(mcpResource);
    } catch (error) {
      this.logger.error(error as Error);
      res.status(500).json({ error: 'Failed to retrieve cars' });
    }
  }

  @Get('/cars/:id')
  async getCarByIdEndpoint(req: express.Request, res: express.Response) {
    try {
      const id = req.params.id;
      this.logger.log('debug', `MCP car by ID endpoint called for ID: ${id}`);

      const carId = parseInt(id, 10);
      if (isNaN(carId)) {
        return res.status(400).json({ error: 'Invalid car ID' });
      }

      // Get car from database using the CarDao
      const car = await this.carDao.getCarById(carId);

      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }

      // Create MCP resource
      const mcpResource = this.mcpService.createResource(
        [car],
        {
          type: 'Car',
          description: 'iRacing car data',
          version: '1.0.0',
          properties: {
            id: 'Unique identifier for the car',
            car_name: 'Full name of the car',
            car_id: 'iRacing ID for the car',
            price: 'Price of the car',
            price_display: 'Formatted price display string',
            has_headlights: 'Whether the car has headlights',
            free_with_subscription: 'Whether the car is free with subscription'
          }
        },
        [
          {
            description: 'Get all cars',
            rel: 'collection',
            href: '/mcp/cars'
          },
          {
            description: 'Get car by ID',
            rel: 'self',
            href: `/mcp/cars/${id}`
          }
        ]
      );

      res.status(200).json(mcpResource);
    } catch (error) {
      this.logger.error(error as Error);
      res.status(500).json({ error: 'Failed to retrieve car' });
    }
  }

  @Get('/tracks')
  async getTracks(_req: express.Request, res: express.Response) {
    try {
      this.logger.log('debug', 'MCP tracks endpoint called');

      // Get tracks from database using the TrackDao
      const tracks = await this.trackDao.getAllTracks();

      // Create MCP resource
      const mcpResource = this.mcpService.createResource(
        tracks,
        {
          type: 'Track',
          description: 'iRacing track data',
          version: '1.0.0',
          properties: {
            id: 'Unique identifier for the track',
            track_name: 'Full name of the track',
            track_id: 'iRacing ID for the track',
            price: 'Price of the track',
            price_display: 'Formatted price display string',
            free_with_subscription:
              'Whether the track is free with subscription',
            pit_road_speed_limit: 'Speed limit on pit road'
          }
        },
        [
          {
            description: 'Get all tracks',
            rel: 'self',
            href: '/mcp/tracks'
          },
          {
            description: 'Get track by ID',
            rel: 'item',
            href: '/mcp/tracks/{id}'
          }
        ]
      );

      res.status(200).json(mcpResource);
    } catch (error) {
      this.logger.error(error as Error);
      res.status(500).json({ error: 'Failed to retrieve tracks' });
    }
  }

  @Get('/tracks/:id')
  async getTrackByIdEndpoint(req: express.Request, res: express.Response) {
    try {
      const id = req.params.id;
      this.logger.log('debug', `MCP track by ID endpoint called for ID: ${id}`);

      const trackId = parseInt(id, 10);
      if (isNaN(trackId)) {
        return res.status(400).json({ error: 'Invalid track ID' });
      }

      // Get track from database using the TrackDao
      const track = await this.trackDao.getTrackById(trackId);

      if (!track) {
        return res.status(404).json({ error: 'Track not found' });
      }

      // Create MCP resource
      const mcpResource = this.mcpService.createResource(
        [track],
        {
          type: 'Track',
          description: 'iRacing track data',
          version: '1.0.0',
          properties: {
            id: 'Unique identifier for the track',
            track_name: 'Full name of the track',
            track_id: 'iRacing ID for the track',
            price: 'Price of the track',
            price_display: 'Formatted price display string',
            free_with_subscription:
              'Whether the track is free with subscription',
            pit_road_speed_limit: 'Speed limit on pit road'
          }
        },
        [
          {
            description: 'Get all tracks',
            rel: 'collection',
            href: '/mcp/tracks'
          },
          {
            description: 'Get track by ID',
            rel: 'self',
            href: `/mcp/tracks/${id}`
          }
        ]
      );

      res.status(200).json(mcpResource);
    } catch (error) {
      this.logger.error(error as Error);
      res.status(500).json({ error: 'Failed to retrieve track' });
    }
  }
}
