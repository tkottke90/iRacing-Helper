import { Neo4jQueryBuilder } from './query-builder';

describe('Neo4jQueryBuilder', () => {
  // Class construction tests
  describe('constructor', () => {
    it('should initialize with default values', () => {
      // Arrange
      const builder = new Neo4jQueryBuilder();

      // Assert
      expect(builder).toBeInstanceOf(Neo4jQueryBuilder);
      expect(builder.build()).toEqual({
        query: 'RETURN ',
        params: {}
      });
    });
  });

  // Method tests
  describe('build', () => {
    it('should build a query with a custom return statement', () => {
      // Arrange
      const expectedQuery = 'MATCH (test:TestLabel {id: $test_id}) RETURN test';
      const expectedParams = { test_id: 1 };

      const builder = new Neo4jQueryBuilder()
        .select('TestLabel', 'test', { id: 1 })
        .customReturn('test');

      // Act
      const { query, params } = builder.build();

      // Assert
      expect(query).toBe(expectedQuery);
      expect(params).toEqual(expectedParams);
    });
  });

  describe('buildNodeReference', () => {
    it('should build a node reference with a label and properties', () => {
      // Arrange
      const expectedNodeReference = 'test:TestLabel {id: $test_id}';
      const expectedParams = { test_id: 1 };

      const builder = new Neo4jQueryBuilder();

      // Act
      const nodeReference = builder.buildNodeReference('test', 'TestLabel', {
        id: 1
      });

      // Assert
      expect(nodeReference).toBe(expectedNodeReference);
      expect(builder.build().params).toEqual(expectedParams);
    });

    it('should omit the properties when none are provided', () => {
      // Arrange
      const expectedNodeReference = 'test:TestLabel';
      const expectedParams = {};

      const builder = new Neo4jQueryBuilder();

      // Act
      const nodeReference = builder.buildNodeReference('test', 'TestLabel');

      // Assert
      expect(nodeReference).toBe(expectedNodeReference);
      expect(builder.build().params).toEqual(expectedParams);
    });
  });

  describe('customReturn', () => {
    it('should build a return statement which includes only the selected nodes', () => {
      // Arrange
      const expectedQuery = 'RETURN car';

      const builder = new Neo4jQueryBuilder()
        .select('Car', 'car', { id: 1 })
        .select('Property', 'prop', { name: 'test' })
        .customReturn('car');

      // Act
      const { query } = builder.build();

      // Assert
      expect(query.endsWith(expectedQuery)).toBeTruthy();
    });
  });

  describe('peek', () => {
    beforeAll(() => {
      // Stub all the console methods
      jest.spyOn(console, 'log').mockReturnValue();
      jest.spyOn(console, 'error').mockReturnValue();
      jest.spyOn(console, 'warn').mockReturnValue();
      jest.spyOn(console, 'debug').mockReturnValue();
      jest.spyOn(console, 'info').mockReturnValue();
      jest.spyOn(console, 'dir').mockReturnValue();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should log the query and parameters', () => {
      // Arrange
      const expectedQuery = 'MATCH (test:TestLabel {id: $test_id}) RETURN test';
      const expectedParams = { test_id: 1 };

      const builder = new Neo4jQueryBuilder()
        .select('TestLabel', 'test', { id: 1 })
        .customReturn('test');

      // Act
      const logSpy = jest.spyOn(console, 'dir').mockReturnValue();
      builder.peek();

      // Assert
      expect(logSpy).toHaveBeenCalledWith({
        query: expectedQuery,
        params: expectedParams
      });
    });
  });

  describe('select', () => {
    it('should build a match statement for the selected node', () => {
      // Arrange
      const expectedQuery = 'MATCH (car:Car {id: $car_id}) RETURN car';
      const expectedParams = { car_id: 1 };

      const builder = new Neo4jQueryBuilder()
        .select('Car', 'car', { id: 1 })
        .customReturn('car');

      // Act
      const { query, params } = builder.build();

      // Assert
      expect(query).toBe(expectedQuery);
      expect(params).toEqual(expectedParams);
    });

    it('should auto-generate a node variable if none is provided', () => {
      // Arrange
      const expectedQuery = 'MATCH (a:Car) RETURN a';
      const expectedParams = {};

      const builder = new Neo4jQueryBuilder().select('Car');

      jest.spyOn(builder as any, 'generateNodeVar').mockReturnValue('a');

      // Act
      const { query, params } = builder.build();

      // Assert
      expect(query).toBe(expectedQuery);
      expect(params).toEqual(expectedParams);
    });
  });

  describe('join', () => {
    it('should create a relationship between two nodes', () => {
      // Arrange
      const expectedQuery =
        'MATCH (car:Car {id: $car_id}) MATCH (track:Property {type: $track_type}) MATCH (car)-[r:RACES_AT]->(track) RETURN car,track';
      const expectedParams = { car_id: 1, track_type: 'ai_enabled' };

      const builder = new Neo4jQueryBuilder()
        .select('Car', 'car', { id: 1 })
        .select('Property', 'prop', { type: 'ai_enabled' })
        .join('car', 'prop', 'from', { variable: 'r', label: 'RACES_AT' })
        .customReturn('car', 'prop');

      // Act
      const { query, params } = builder.build();

      // Assert
      expect(query).toBe(expectedQuery);
      expect(params).toEqual(expectedParams);
    });
  });
});
