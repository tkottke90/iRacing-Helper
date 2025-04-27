import { RelationshipDirections } from '../integrations/neo4j';

export interface QueryOptions<Session, Transaction> {
  session?: Session;
  transaction?: Transaction;
}

export interface TransactionInput {
  query: string;
  params: Record<string, unknown>;
}

/**
 * Interface for defining query parameters when selecting data from a database
 * @template T - The type of object being queried
 */
export interface QueryInterface<T> {
  /**
   * Optional filter conditions for the query
   * Keys are property names of T, values are the conditions to match
   */
  where?: Record<keyof T, unknown>;
}

/**
 * Abstract Database class that defines the standard interface for database operations
 *
 * This class provides a consistent API for different database implementations,
 * allowing for interchangeable database backends while maintaining the same interface.
 * Implementations should handle the specific database connection and query logic.
 */
export abstract class Database<Session = unknown, Transaction = unknown> {
  /**
   * Disconnect from the database
   * @returns A promise that resolves when the connection is successfully closed
   */
  abstract disconnect(): Promise<void>;

  /**
   * Delete a record from the specified table by its ID
   * @template Key - The type of the ID field (defaults to number)
   * @param table - The name of the table to delete from
   * @param id - The unique identifier of the record to delete
   * @returns A promise that resolves to true if deletion was successful, false otherwise
   */
  abstract delete<Key = number>(table: string, id: Key): Promise<boolean>;

  /**
   * Insert a new record into the specified table
   * @template T - The type of the data object being inserted
   * @param table - The name of the table to insert into
   * @param data - The data object to insert
   * @returns A promise that resolves to the inserted data, potentially with additional fields (like ID)
   */
  abstract insert<T extends object = object>(
    table: string,
    data: T
  ): Promise<T>;

  /**
   * Create a relationship between two nodes
   * @param relationshipLabel - The label for the relationship
   * @param source - The ID of the source node
   * @param target - The ID of the target node
   * @param direction - The direction of the relationship
   * @returns A promise that resolves to true if the relationship was created successfully
   */
  abstract join(
    relationshipLabel: string,
    source: number,
    target: number,
    direction?: RelationshipDirections,
    options?: QueryOptions<Session, Transaction>
  ): Promise<boolean>;

  /**
   * Select a record from the specified table based on query parameters
   * @template T - The type of object to be returned
   * @param table - The name of the table to select from
   * @param query - The query parameters to filter results
   * @returns A promise that resolves to the matching record
   */
  abstract select<T extends object = object>(
    table: string,
    query: QueryInterface<T>
  ): Promise<T>;

  /**
   * Update an existing record in the specified table
   * @template T - The type of the data object being updated
   * @template Key - The type of the ID field (defaults to number)
   * @param table - The name of the table to update
   * @param id - The unique identifier of the record to update
   * @param data - The data to update with
   * @returns A promise that resolves to the updated record
   */
  abstract update<T extends object = object, Key = number>(
    table: string,
    id: Key,
    data: T
  ): Promise<T>;

  /**
   * Insert a record if it doesn't exist, or update it if it does
   * @template T - The type of the data object being added/updated
   * @param table - The name of the table to upsert into
   * @param id - The unique identifier to check for existence
   * @param data - The data to insert or update
   * @returns A promise that resolves to the added/updated record
   */
  abstract upsert<T = unknown>(
    table: string,
    id: number,
    data: T,
    options?: QueryOptions<Session, Transaction>
  ): Promise<T[]>;

  /**
   * Execute a database transaction that can contain multiple operations.
   * This executes the provided transaction callback, passing it the transaction
   * object. It handles committing or rolling back the transaction based on the
   * success or failure of the callback.
   * @template T - The type of data being returned by the transaction
   * @returns An AsyncGenerator that yields results and accepts new queries
   */
  abstract transaction<Result>(
    callback: (transaction: Transaction) => Promise<Result>
  ): Promise<Result>;
}
