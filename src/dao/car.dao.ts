import { Container, Inject, Injectable } from '@decorators/di';
import {
  CommonProperties,
  CreateCar,
  createCarSchema,
  Car
} from '../dto/car.dto';
import { Database, QueryOptions } from '../interfaces/database';
import { LoggerService } from '../services';
import { iRacingCar, iRacingCarSchema } from '../interfaces/car.iracing';
import { prettyPrintSnakeCase } from '../utilities/string.utils';

@Injectable()
export class CarDao {
  constructor(
    @Inject('Database')
    private readonly database: Database,

    @Inject('LoggerService')
    private readonly logger: LoggerService
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

      // There are a number of properties that each car has and instead
      // of making those properties of the nodes themselves, we want to
      // instead create a relationship between the car and the property
      await this.database.execute(
        [
          'UNWIND $properties AS property',
          'MERGE (p:Property {type: property.type})',
          'ON CREATE SET p = property, p.createdAt = datetime(), p.updatedAt = datetime()',
          'ON MATCH SET p += property, p.updatedAt = datetime()',
          'WITH p',
          'MATCH (c:Car {id: $car_id})',
          'MERGE (c)-[:HAS_PROPERTY]->(p)'
        ].join(' '),
        {
          car_id: carRecord.id,
          properties: CommonProperties.map((property) => ({
            type: property,
            name: prettyPrintSnakeCase(property)
          }))
        },
        { transaction }
      );

      this.logger.log('debug', 'Created Car', {
        car: carRecord.car_name
      });

      return carRecord;
    });
  }

  async upsertCar(
    id: number,
    data: CreateCar,
    options?: QueryOptions<unknown, unknown>
  ) {
    return await this.database.upsert<Car>('Car', id, { ...data, id }, options);
  }
}

Container.provide([{ provide: 'CarDao', useClass: CarDao }]);
