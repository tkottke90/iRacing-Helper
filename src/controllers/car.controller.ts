import express from 'express';
import { loggerService, mcpService } from '../services';
import { carDao } from '../dao/car.dao';
import { CarDTO } from '../dto/car.dto';

export class CarController {
  private readonly logger = loggerService;
  private readonly mcpService = mcpService;
  private readonly carDao = carDao;

  /**
   * MCP endpoint for cars
   * Returns car data in Model Context Protocol format
   */
  async getCarsMCP(res: express.Response) {
    try {
      this.logger.log('debug', 'Car MCP endpoint called');

      // Get all cars from the database
      const cars = await this.carDao.findCars({});

      // Use the toCarDTO method to transform the data if needed
      const carDTOs = await Promise.all(
        cars.map((car) => this.carDao.toCarDTO(car as CarDTO))
      );

      // Create MCP resource
      const mcpResource = this.mcpService.createResource(
        carDTOs,
        {
          type: 'Car',
          description: 'iRacing car data with properties',
          version: '1.0.0',
          properties: {
            id: 'Unique identifier for the car',
            car_name: 'Full name of the car',
            car_id: 'iRacing ID for the car',
            price: 'Price of the car',
            price_display: 'Formatted price display string',
            has_headlights: 'Whether the car has headlights',
            free_with_subscription: 'Whether the car is free with subscription',
            properties: 'Additional car properties'
          }
        },
        [
          {
            description: 'Get all cars with properties',
            rel: 'self',
            href: '/cars/mcp'
          },
          {
            description: 'Get all cars',
            rel: 'collection',
            href: '/mcp/cars'
          }
        ]
      );

      res.status(200).json(mcpResource);
    } catch (error) {
      this.logger.error(error as Error, 'Failed to retrieve cars');
      res.status(500).json({ error: 'Failed to retrieve cars' });
    }
  }
}
