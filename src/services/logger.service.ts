import { Container, Inject, Injectable } from '@decorators/di';
import { EnvironmentService } from './environment.service';

const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const;

type tempLevels = (typeof levels)[number];

interface ILoggerService<Levels extends string> {
  log: (level: Levels, message: string, metadata?: Record<string, any>) => void;
  error: (error: Error) => void;
}

@Injectable()
export class LoggerService implements ILoggerService<tempLevels> {
  constructor(
    @Inject('EnvironmentService')
    private readonly envService: EnvironmentService
  ) {}

  log(level: tempLevels, message: string, metadata?: Record<string, any>) {
    const logLevel = (
      this.envService.get('LOG_LEVEL') ?? 'info'
    ).toLowerCase() as tempLevels;

    if (levels.indexOf(level) < levels.indexOf(logLevel)) {
      return;
    }

    const metadataStr = metadata ? JSON.stringify(metadata) : '';

    console.log(
      `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message} ${metadataStr}`
    );
  }

  error(error: Error, customMessage?: string) {
    if (customMessage) {
      this.log('error', customMessage, {
        message: error.message,
        stack: error.stack
      });
    } else {
      this.log('error', error.message);
    }
  }
}

Container.provide([{ provide: 'LoggerService', useClass: LoggerService }]);
