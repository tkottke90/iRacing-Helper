import 'reflect-metadata';
import { EnvironmentService } from '../services/environment.service';

/**
 * Decorator that injects an environment variable value into a class property or constructor parameter.
 *
 * @param envKey The environment variable key to look up
 * @param defaultValue Optional default value if the environment variable is not set
 * @returns A decorator that can be used on class properties or constructor parameters
 *
 * @example
 * ```typescript
 * // As a parameter decorator
 * @Injectable()
 * class MyService {
 *   constructor(
 *     @EnvVar('API_URL') private readonly apiUrl: string,
 *     @EnvVar('API_TIMEOUT', '5000') private readonly timeout: string
 *   ) {
 *     console.log(`Using API URL: ${apiUrl} with timeout: ${timeout}`);
 *   }
 * }
 *
 * // As a property decorator
 * @Injectable()
 * class ConfigService {
 *   @EnvVar('API_URL')
 *   private readonly apiUrl: string;
 *
 *   @EnvVar('API_TIMEOUT', '5000')
 *   private readonly timeout: string;
 *
 *   constructor() {
 *     console.log(`Using API URL: ${this.apiUrl} with timeout: ${this.timeout}`);
 *   }
 * }
 * ```
 */
export function EnvVar(
  envKey: string,
  defaultValue?: string
): PropertyDecorator & ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndexOrDescriptor?: number | PropertyDescriptor
  ) => {
    // Get the environment service
    const envService = new EnvironmentService();

    // If parameterIndexOrDescriptor is a number, it's being used as a parameter decorator
    if (typeof parameterIndexOrDescriptor === 'number') {
      const parameterIndex = parameterIndexOrDescriptor;

      // Get the constructor function
      const constructor =
        target instanceof Function ? target : target.constructor;

      // Get or create metadata for environment variable parameters
      const envVarParams: Map<number, { key: string; defaultValue?: string }> =
        Reflect.getOwnMetadata('env:vars', constructor) || new Map();

      // Store the environment variable key and default value for this parameter
      envVarParams.set(parameterIndex, { key: envKey, defaultValue });

      // Update the metadata
      Reflect.defineMetadata('env:vars', envVarParams, constructor);

      // Create a factory for this class if it doesn't exist yet
      if (!Reflect.hasOwnMetadata('env:factory-applied', constructor)) {
        // Store the original constructor
        const originalConstructor = constructor;

        // Create a proxy constructor that will handle the environment variable injection
        const newConstructor = function (...args: unknown[]) {
          // Get the environment variable parameters
          const envVarParams: Map<
            number,
            { key: string; defaultValue?: string }
          > =
            Reflect.getOwnMetadata('env:vars', originalConstructor) ||
            new Map();

          // Replace constructor arguments with environment variable values where needed
          envVarParams.forEach((envVarInfo, paramIndex) => {
            // If an argument was provided, don't override it
            if (args[paramIndex] === undefined) {
              // Get the environment variable value
              const value =
                envService.get(envVarInfo.key) || envVarInfo.defaultValue;
              args[paramIndex] = value;
            }
          });

          // Call the original constructor with the modified arguments
          return new (originalConstructor as new (
            ...args: unknown[]
          ) => unknown)(...args);
        };

        // Copy prototype
        newConstructor.prototype = originalConstructor.prototype;

        // Mark this constructor as having the factory applied
        Reflect.defineMetadata(
          'env:factory-applied',
          true,
          originalConstructor
        );

        // Replace the original constructor with our proxy
        Object.defineProperty(target, 'constructor', {
          value: newConstructor,
          writable: true,
          configurable: true
        });
      }
    }
    // If it's undefined or a PropertyDescriptor, it's being used as a property decorator
    else {
      // Get the constructor function
      const constructor = target.constructor;

      // Get or create metadata for environment variable properties
      const envVarProps: Map<
        string | symbol,
        { key: string; defaultValue?: string }
      > = Reflect.getOwnMetadata('env:props', constructor) || new Map();

      // Store the environment variable key and default value for this property
      if (propertyKey) {
        envVarProps.set(propertyKey, { key: envKey, defaultValue });
      }

      // Update the metadata
      Reflect.defineMetadata('env:props', envVarProps, constructor);

      // Apply property initialization if not already applied
      if (!Reflect.hasOwnMetadata('env:props-init-applied', constructor)) {
        // Store the original constructor
        const originalConstructor = constructor as {
          new (...args: unknown[]): unknown;
        };

        // Create a proxy constructor that will handle the environment variable injection for properties
        const newConstructor = function (
          this: Record<string | symbol, unknown>,
          ...args: unknown[]
        ) {
          // Call the original constructor
          const instance = new originalConstructor(...args) as Record<
            string | symbol,
            unknown
          >;

          // Get the environment variable properties
          const envVarProps: Map<
            string | symbol,
            { key: string; defaultValue?: string }
          > = Reflect.getOwnMetadata('env:props', constructor) || new Map();

          // Set property values from environment variables
          envVarProps.forEach((envVarInfo, propKey) => {
            // Get the environment variable value
            const value =
              envService.get(envVarInfo.key) || envVarInfo.defaultValue;

            // Only set the property if it's undefined (don't override explicitly set values)
            if (instance[propKey] === undefined) {
              Object.defineProperty(instance, propKey, {
                value,
                writable: true,
                enumerable: true,
                configurable: true
              });
            }
          });

          return instance;
        };

        // Copy prototype and static properties
        newConstructor.prototype = originalConstructor.prototype;
        Object.setPrototypeOf(newConstructor, originalConstructor);

        // Mark this constructor as having property initialization applied
        Reflect.defineMetadata('env:props-init-applied', true, constructor);

        // Replace the original constructor with our proxy
        Object.defineProperty(target, 'constructor', {
          value: newConstructor,
          writable: true,
          configurable: true
        });
      }
    }
  };
}
