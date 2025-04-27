// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Container, Inject } from '@decorators/di';
import { LoggerService } from '../services/logger.service';
import { QueryBuilder } from './query-builder';
import {
  Driver,
  Session,
  driver,
  auth,
  QueryResult,
  Transaction
} from 'neo4j-driver';
import { Database, QueryInterface, QueryOptions } from '../interfaces/database';

export type Node<T> = T & { labels: string[]; id: number };

/**
 * Defines the possible directions for a relationship between nodes
 * - 'from': Relationship goes from source to target (source -> target)
 * - 'to': Relationship goes from target to source (source <- target)
 * - 'both': Bidirectional relationship (source <-> target)
 * - 'none': Undirected relationship (source - target)
 */
export type RelationshipDirections = 'from' | 'to' | 'both' | 'none';

/**
 * Neo4j database implementation with singleton pattern
 * This class provides methods to interact with a Neo4j database
 * and ensures only one connection is created across the application
 */
export class Neo4j extends Database<Session, Transaction> {
  /**
   * Singleton instance of the Neo4j class
   * @private
   */
  private static instance: Driver | null = null;

  /**
   * @param logger - Logger service instance
   * @private
   */
  constructor(
    @Inject('LoggerService')
    private readonly logger: LoggerService
  ) {
    super();
  }

  /**
   * Deletes a node with the specified ID
   * @template Key - The type of the node ID
   * @param nodeLabel - The label of the node to delete
   * @param id - The ID of the node to delete
   * @param options - Query options
   * @returns A promise that resolves to true if the node was deleted successfully
   */
  async delete<Key = number>(
    nodeLabel: string,
    id: Key,
    options: QueryOptions<Session, Transaction> = {}
  ): Promise<boolean> {
    try {
      const result = await this.execute(
        `MATCH (n:${nodeLabel}) WHERE id(n) = $id DELETE n`,
        { id },
        options
      );
      return result.records.length > 0;
    } catch (error: unknown) {
      this.logger.error(error as Error, 'Unable to delete node with id');
      return false;
    }
  }

  /**
   * Disconnects from the Neo4j database and clears the singleton instance
   * @returns Promise that resolves when the connection is closed
   */
  async disconnect(): Promise<void> {
    const driver = await Neo4j.getInstance();
    if (driver) {
      await driver.close();
      console.log('Disconnected from Neo4j');

      // Clear the singleton instance when disconnecting
      Neo4j.instance = null;
    }
  }

  /**
   * Inserts a new node into the database
   * @template T - The type of data to insert
   * @param nodeLabel - The label for the new node
   * @param data - The data to insert
   * @param options - Query options
   * @returns A promise that resolves to the inserted data
   */
  async insert<T extends object = object>(
    nodeLabel: string,
    data: T,
    options: QueryOptions<Session, Transaction> = {}
  ): Promise<T> {
    return this.execute(
      `CREATE (n:${nodeLabel} $data) RETURN n`,
      { data },
      options
    ).then((result) => result.records[0].get('n').properties as T);
  }

  /**
   * Create a relationship between two nodes
   * @param relationshipLabel - The label for the relationship
   * @param source - The ID of the source node
   * @param target - The ID of the target node
   * @param direction - The direction of the relationship
   * @param options - Query options
   * @returns A promise that resolves to true if the relationship was created successfully
   */
  async join(
    relationshipLabel: string,
    source: number,
    target: number,
    direction: RelationshipDirections,
    options: QueryOptions<Session, Transaction> = {}
  ): Promise<boolean> {
    try {
      let directionStr = `-[r:${relationshipLabel}]-`;
      switch (direction) {
        case 'from':
          directionStr = `-[r:${relationshipLabel}]->`;
          break;
        case 'to':
          directionStr = `<-[r:${relationshipLabel}]-`;
          break;
        case 'both':
          directionStr = `-[r:${relationshipLabel}]-`;
          break;
      }

      const queryStr = [
        'MATCH (n) WHERE n.id = $source',
        'WITH n as source',
        'MATCH (m) where m.id = $target',
        'WITH m as target, source',
        `MERGE (source)${directionStr}(target)`,
        'RETURN r'
      ].join(' ');

      const result = await this.execute(queryStr, { source, target }, options);

      return result.records.length > 0;
    } catch (error) {
      this.logger.error(error as Error, 'Unable to join nodes');
      return false;
    }
  }

  /**
   * Selects nodes from the database based on a query
   * @template T - The type of data to select
   * @param table - The label of the nodes to select
   * @param query - The query to filter nodes
   * @param options - Query options
   * @returns A promise that resolves to the selected data
   */
  async select<T extends object = object>(
    table: string,
    query: QueryInterface<T>,
    options: QueryOptions<Session, Transaction> = {}
  ): Promise<T> {
    const nodeVar = table.toLocaleLowerCase();

    const { query: queryStr, params } = new QueryBuilder(
      nodeVar,
      query
    ).build();

    return this.execute(
      `MATCH (${nodeVar}:${table}) WHERE ${queryStr} RETURN ${nodeVar}`,
      params,
      options
    ).then((result) => result.records[0].get('n').properties as T);
  }

  /**
   * Execute a database transaction that can contain multiple operations
   * @template T - The return type of the transaction
   * @param callback - The function to execute within the transaction
   * @returns A promise that resolves to the result of the transaction
   */
  async transaction<T>(callback: (transaction: Transaction) => Promise<T>) {
    const session: Session = await this.getSession();
    const tsx = session.beginTransaction();

    try {
      const result = await callback(tsx);

      await tsx.commit();

      return result;
    } catch (error) {
      await tsx.rollback();

      this.logger.error(error as Error, 'Transaction failed');

      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * Updates an existing node in the database
   * @template T - The type of data to update
   * @template Key - The type of the node ID
   * @param nodeLabel - The label of the node to update
   * @param id - The ID of the node to update
   * @param data - The data to update
   * @param options - Query options
   * @returns A promise that resolves to the updated data
   */
  async update<T = unknown, Key = number>(
    nodeLabel: string,
    id: Key,
    data: T,
    options: QueryOptions<Session, Transaction> = {}
  ): Promise<T> {
    return this.execute(
      `MATCH (n:${nodeLabel}) WHERE id(n) = $id SET n += $data RETURN n`,
      {
        id,
        data
      },
      options
    ).then((result) => result.records[0].get('n').properties as T);
  }

  /**
   * Updates an existing node or creates it if it doesn't exist
   * @template T - The type of data to upsert
   * @param nodeLabel - The label of the node to upsert
   * @param id - The ID of the node to upsert
   * @param data - The data to upsert
   * @param options - Query options
   * @returns A promise that resolves to an array of the upserted nodes
   */
  async upsert<T>(
    nodeLabel: string,
    id: number,
    data: T,
    options: QueryOptions<Session, Transaction> = {}
  ): Promise<T[]> {
    return this.execute(
      `MERGE (n:${nodeLabel} {id: $id}) SET n += $data RETURN n`,
      {
        id,
        data
      },
      options
    ).then((result) => this.parseResponse<T>(result));
  }

  /**
   * Executes a Cypher query against the Neo4j database
   * @param query - The Cypher query to execute
   * @param params - The parameters to use in the query
   * @param options - Query options
   * @returns A Promise resolving to the QueryResult
   * @private
   */
  private async execute(
    query: string,
    params: Record<string, unknown> = {},
    options: QueryOptions<Session, Transaction> = {}
  ): Promise<QueryResult> {
    const session: Session | Transaction =
      options.transaction ?? options.session ?? (await this.getSession());

    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  /**
   * Gets a Neo4j session from the driver
   * @returns A Neo4j session
   * @private
   */
  private async getSession() {
    const driver = await Neo4j.getInstance();

    if (!driver) {
      throw new Error('Failed to get Neo4j driver instance');
    }

    return driver.session();
  }

  /**
   * Parses a Neo4j QueryResult into an array of Node objects
   * @template T - The type of data in the nodes
   * @param result - The Neo4j QueryResult to parse
   * @returns An array of Node objects with the properties from the result
   * @protected
   */
  protected parseResponse<T>(result: QueryResult): Node<T>[] {
    const data = result.records.flatMap((record) => {
      const recordMetadata = record.toObject();

      return Object.values(recordMetadata).map((record) => {
        return {
          ...record.properties,
          labels: record.labels
        };
      });
    });
    return data as Node<T>[];
  }

  /**
   * Creates a connection to the Neo4j database or returns the existing connection
   * @returns Promise resolving to the Neo4j instance
   */
  static async connect() {
    // If an instance already exists, return it
    if (Neo4j.instance) {
      return Neo4j.instance;
    }

    Neo4j.instance = driver(
      'bolt://localhost:7687', // Replace with your Neo4j instance URL
      auth.basic('neo4j', 'your_password') // Replace with your credentials
    );
    console.log('Connected to Neo4j');

    return Neo4j.instance;
  }

  /**
   * Gets the singleton instance of the Neo4j class
   * @returns Promise resolving to the Neo4j instance
   * @throws Error if called before connect()
   */
  static async getInstance() {
    if (!Neo4j.instance) {
      return Neo4j.connect();
    }
    return Neo4j.instance;
  }
}

Container.provide([{ provide: 'Database', useClass: Neo4j }]);
