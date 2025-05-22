import { Container, Inject, Injectable } from '@decorators/di';
import { ExternalAPIService } from '../interfaces/external-api';
import { iRacingSignedResourceResponse } from '../interfaces/iracing.interface';
import { EnvironmentService } from './environment.service';
import { LoggerService } from './logger.service';
import { UnauthorizedError } from '../utilities/errors.util';
import { iRacingTrack } from '../interfaces/track.iracing';
import { Neo4j } from 'neo4j-helper';
import { iRacingCar } from '../interfaces/car.iracing';

const AUTH_TOKEN_COOKIE_KEY = 'authtoken_members=';

@Injectable()
export class iRacingService extends ExternalAPIService {
  private readonly username: string;
  private readonly password: string;

  constructor(
    @Inject('EnvironmentService')
    envService: EnvironmentService,

    @Inject('LoggerService')
    private readonly logger: LoggerService
  ) {
    super(envService.get('IRACING_API_URL'));

    this.username = envService.get('IRACING_USERNAME');
    this.password = envService.get('IRACING_PASSWORD');
  }

  protected async authenticate(requestInit: RequestInit): Promise<RequestInit> {
    // If the token has not yet expired
    if (!this.tokenCache || this.tokenExpiry < Date.now()) {
      const reqBody = JSON.stringify({
        email: this.username,
        password: this.password
      });

      const result = await fetch(`${this.baseUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: reqBody
      });

      const headers = result.headers;
      const cookies = result.headers.getSetCookie();
      const body = await result.json();

      console.dir({
        headers,
        cookies,
        body
      });

      const authTokenCookie =
        cookies.find((cookie) => cookie.startsWith(AUTH_TOKEN_COOKIE_KEY)) ??
        '';

      const tokenValue = authTokenCookie.split(';')[0];

      if (tokenValue === AUTH_TOKEN_COOKIE_KEY) {
        // iRacing returns a 200 with the error if the authentication fails
        throw new UnauthorizedError(
          'Failed to authenticate with iRacing API - ' + body.message
        );
      }

      this.tokenCache = tokenValue;
      this.tokenExpiry = Date.now() + 3600000;
    }

    // Add the token as a cookie called authtoken_members
    requestInit.headers = {
      ...requestInit.headers,
      Cookie: this.tokenCache
    };

    return requestInit;
  }

  async getResourceLink<T>(path: string) {
    this.logger.log('debug', '[iRacing Resource Link] Fetching signed url');
    const result = await this.callApi<iRacingSignedResourceResponse>(path, {
      method: 'GET'
    });

    this.logger.log('debug', '[iRacing Resource Link] Fetching data');
    const response = await fetch(result.link);

    return response.json() as T;
  }

  async getAllCars() {
    return await this.getResourceLink<iRacingCar[]>('/data/car/get');
  }

  async getAllCarClasses() {
    return await this.getResourceLink<unknown[]>('/data/carclass/get');
  }

  async getAllTracks() {
    return this.getResourceLink<iRacingTrack[]>('/data/track/get');
  }

  async getDriverProfile(userId: number) {
    return this.getResourceLink(`/data/member/profile?cust_id=${userId}`);
  }
}

Container.provide([{ provide: 'iRacingService', useClass: iRacingService }]);
