import { Container, Inject, Injectable } from '@decorators/di';
import {
  CommonProperties,
  CreateCarDTO,
  createCarSchema,
  CarDTO,
  CarWithPropertiesDTO,
  CarPropertyDTO
} from '../dto/car.dto';
import { Database, QueryInterface, QueryOptions } from '../interfaces/database';
import { LoggerService } from '../services';
import { iRacingCar, iRacingCarSchema } from '../interfaces/car.iracing';
import { prettyPrintSnakeCase } from '../utilities/string.utils';
import { QueryResult, Record as Neo4jRecord } from 'neo4j-driver';
import { iRacingPropertiesDao } from './iracing-properties.dao';
import { Neo4jQueryBuilder } from '../integrations/query-builder';

@Injectable()
export class CarDao {
  constructor(
    @Inject('Database')
    private readonly database: Database,

    @Inject('LoggerService')
    private readonly logger: LoggerService,

    @Inject('iRacingPropertiesDao')
    private readonly iRacingPropertiesDao: iRacingPropertiesDao
  ) {}

  async createFromIRacing(car: iRacingCar) {
    // Validate the iRacing Car Data
    const parsedInput = iRacingCarSchema.safeParse(car);

    if (!parsedInput.success) {
      throw new Error(parsedInput.error.message);
    }

    return await this.database.transaction(async (transaction) => {
      const parsedCar = createCarSchema.parse(parsedInput.data);

      const carRecord = await this.upsertCar(
        parsedInput.data.car_id,
        parsedCar,
        { transaction }
      );

      await this.iRacingPropertiesDao.bulkUpsertAndAttach(
        CommonProperties.map((property) => ({
          name: prettyPrintSnakeCase(property),
          type: property
        })),
        { label: 'Car', id: carRecord.id },
        transaction
      );

      this.logger.log('debug', 'Created Car', {
        car: carRecord.car_name
      });

      return carRecord;
    });
  }

  async findCars(query: QueryInterface<CarDTO>): Promise<CarDTO[]> {
    const findQuery = new Neo4jQueryBuilder()
      .select('Car', 'c', query.where)
      .select('Property', 'p')
      .join('c', 'p')
      .peek();

    return await this.database.select<CarDTO>('Car', query);
  }

  async upsertCar(
    id: number,
    data: CreateCarDTO,
    options?: QueryOptions<unknown, unknown>
  ) {
    return await this.database.upsert<CarDTO>(
      'Car',
      id,
      { ...data, id },
      options
    );
  }

  /**
   * Get all cars from the database
   * @returns Promise resolving to an array of cars
   */
  async getAllCars(): Promise<CarDTO[]> {
    try {
      return await this.database.select<CarDTO>('Car', {});
    } catch (error) {
      this.logger.error(
        error as Error,
        'Failed to retrieve cars from database'
      );
      return [];
    }
  }

  /**
   * Get a car by ID
   * @param id The car ID
   * @returns Promise resolving to a car or null if not found
   */
  async getCarById(id: number): Promise<CarDTO | null> {
    try {
      const result = await this.database.execute<QueryResult>(
        'MATCH (c:Car {id: $id}) RETURN c',
        { id }
      );

      if (result.records.length === 0) {
        return null;
      }

      return (result.records[0] as Neo4jRecord).get('c').properties as CarDTO;
    } catch (error) {
      this.logger.error(
        error as Error,
        `Failed to retrieve car with ID ${id} from database`
      );
      return null;
    }
  }

  /**
   * Convert a CarDTO to a CarWithPropertiesDTO by fetching related properties
   * @param car The car to convert
   * @returns Promise resolving to a car with its properties
   */
  async toCarDTO(car: CarDTO): Promise<CarWithPropertiesDTO> {
    try {
      // Get properties for this car
      const rawProperties =
        await this.iRacingPropertiesDao.getPropertiesForEntity('Car', car.id);

      // Convert properties to the expected format with proper type casting
      const properties = rawProperties.map((prop) => ({
        type: prop.type as CarPropertyDTO,
        name: prop.name
      }));

      // Return car with properties
      return {
        ...car,
        properties
      };
    } catch (error) {
      this.logger.error(
        error as Error,
        `Failed to get properties for car with ID ${car.id}`
      );

      // Return car without properties if there was an error
      return {
        ...car,
        properties: []
      };
    }
  }
}

Container.provide([{ provide: 'CarDao', useClass: CarDao }]);
