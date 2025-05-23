import { Neo4j } from 'neo4j-helper/neo4j';
import { type Logger } from 'neo4j-helper';

const logger: Logger = {
  log: (message: unknown) => {
    console.log(message);
  },
  error: (message: unknown) => {
    console.error(message);
  },
  debug: function (...args: unknown[]): void {
    console.log(...args);
  },
  warn: function (...args: unknown[]): void {
    console.warn(...args);
  }
};

// Export singleton instance
export const database = new Neo4j(logger);
