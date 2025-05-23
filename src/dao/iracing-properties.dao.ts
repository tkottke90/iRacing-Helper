import {
  ManagedTransaction,
  Record as Neo4jRecord,
  QueryResult
} from 'neo4j-driver';
import { Neo4j } from 'neo4j-helper';
import { loggerService } from '../services/logger.service';
import { database } from '../integrations/neo4j';
import { prettyPrintSnakeCase } from '../utilities/string.utils';

interface iRacingProperty {
  name: string;
  type: string;
}

/**
 * Data Access Object for iRacing Properties
 * Handles database operations related to iRacing properties
 */
class IRacingPropertiesDao {
  readonly label = 'Property';
  readonly relationship = 'HAS_PROPERTY';
  private readonly database = database;
  private readonly logger = loggerService;

  /**
   * Upsert an iRacing property
   * This method will be implemented later
   */
  async bulkUpsertAndAttach(
    properties: iRacingProperty[],
    relatedEntity: { label: string; id: number },
    transaction?: ManagedTransaction
  ) {
    // There are a number of properties that each car has and instead
    // of making those properties of the nodes themselves, we want to
    // instead create a relationship between the car and the property
    await this.database.execute(
      [
        'UNWIND $properties AS property',
        `MERGE (p:${this.label} { type: property.type })`,
        'ON CREATE SET p = property, p.createdAt = datetime(), p.updatedAt = datetime()',
        'ON MATCH SET p += property, p.updatedAt = datetime()',
        'WITH p',
        `MATCH (c:${relatedEntity.label} {id: $relatedEntityId})`,
        `MERGE (c)-[${this.relationship}]->(p)`
      ].join(' '),
      {
        relatedEntityId: relatedEntity.id,
        properties: properties.map((property) => ({
          type: property.name,
          name: prettyPrintSnakeCase(property.name)
        }))
      },
      { transaction }
    );
  }

  async getPropertiesRelatedTo(label: string) {
    return await this.database.execute<QueryResult>(
      [
        `MATCH (e:${label} {id: $id})`,
        '-[:HAS_PROPERTY]->(p:Property)',
        'RETURN e,r,p'
      ].join(' '),
      {}
    );
  }

  async getPropertiesForEntity(
    label: string,
    id: number
  ): Promise<iRacingProperty[]> {
    const result = await this.database.execute<QueryResult>(
      [
        `MATCH (e:${label} {id: $id})`,
        '-[:HAS_PROPERTY]->(p:Property)',
        'RETURN p'
      ].join(' '),
      { id }
    );

    return result.records.map((record: Neo4jRecord) => {
      const properties = record.get('p').properties as iRacingProperty;
      return {
        name: properties.name,
        type: properties.type
      };
    });
  }
}

// Export singleton instance
export const iRacingPropertiesDao = new IRacingPropertiesDao();
