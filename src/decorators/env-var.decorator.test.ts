import { EnvVar } from './env-var.decorator';
import { environmentService } from '../services/environment.service';

// Mock the environment service
jest.mock('../services/environment.service', () => {
  return {
    EnvironmentService: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn((key: string) => {
          const mockEnv: Record<string, string> = {
            TEST_API_URL: 'https://api.example.com',
            TEST_API_KEY: 'test-api-key',
            TEST_TIMEOUT: '5000'
          };
          return mockEnv[key];
        })
      };
    })
  };
});

describe('EnvVar Decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('as a property decorator', () => {
    it('should populate class properties with environment variable values', () => {
      // Define a class with decorated properties
      class TestService {
        @EnvVar('TEST_API_URL')
        apiUrl!: string;

        @EnvVar('TEST_API_KEY')
        apiKey!: string;

        @EnvVar('TEST_TIMEOUT', '3000')
        timeout!: string;

        @EnvVar('NON_EXISTENT_VAR', 'default-value')
        defaultValue!: string;
      }

      // Instantiate the class
      const service = new TestService();

      // Check that the properties were populated correctly
      expect(service.apiUrl).toBe('https://api.example.com');
      expect(service.apiKey).toBe('test-api-key');
      expect(service.timeout).toBe('5000');
      expect(service.defaultValue).toBe('default-value');
    });

    it('should not override explicitly set values', () => {
      class TestService {
        @EnvVar('TEST_API_URL')
        apiUrl: string = 'https://custom.example.com';

        @EnvVar('TEST_API_KEY')
        apiKey!: string;
      }

      const service = new TestService();

      // The explicitly set value should not be overridden
      expect(service.apiUrl).toBe('https://custom.example.com');
      expect(service.apiKey).toBe('test-api-key');
    });
  });

  describe('as a parameter decorator', () => {
    it('should inject environment variable values into constructor parameters', () => {
      class TestService {
        constructor(
          @EnvVar('TEST_API_URL') public apiUrl: string,
          @EnvVar('TEST_API_KEY') public apiKey: string,
          @EnvVar('TEST_TIMEOUT', '3000') public timeout: string,
          @EnvVar('NON_EXISTENT_VAR', 'default-value') public defaultValue: string
        ) {}
      }

      const service = new TestService('', '', '', '');

      expect(service.apiUrl).toBe('https://api.example.com');
      expect(service.apiKey).toBe('test-api-key');
      expect(service.timeout).toBe('5000');
      expect(service.defaultValue).toBe('default-value');
    });

    it('should not override explicitly provided constructor arguments', () => {
      class TestService {
        constructor(
          @EnvVar('TEST_API_URL') public apiUrl: string,
          @EnvVar('TEST_API_KEY') public apiKey: string
        ) {}
      }

      const service = new TestService('https://custom.example.com', '');

      expect(service.apiUrl).toBe('https://custom.example.com');
      expect(service.apiKey).toBe('test-api-key');
    });
  });
});
