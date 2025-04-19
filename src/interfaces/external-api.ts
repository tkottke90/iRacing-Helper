import { Injectable } from '@decorators/di';

type ResponseParser<T> = (response: Response) => Promise<T>;

export function parseJsonResponse<T>(response: Response): Promise<T> {
  return response.json();
}

@Injectable()
export class ExternalAPIService {
  protected tokenCache = '';
  protected tokenExpiry = 0;

  constructor(protected readonly baseUrl: string) {
    if (!baseUrl) {
      throw new Error('baseUrl is required');
    }
  }

  /**
   * Authentication hook that should be overridden by extending classes to implement
   * their specific authentication patterns. This method allows child classes to modify
   * the request configuration to include necessary authentication headers, tokens,
   * or other authentication-related data.
   *
   * @param requestInit - The initial request configuration object
   * @returns Modified RequestInit object with authentication details
   */
  protected async authenticate(requestInit: RequestInit): Promise<RequestInit> {
    return requestInit;
  }

  protected async callApi<T>(
    path: string,
    requestInit: RequestInit = {},
    parser: ResponseParser<T> = parseJsonResponse
  ): Promise<T> {
    await this.authenticate(requestInit);

    return fetch(
      `${this.stripTrailingSlash(this.baseUrl)}/${this.stripLeadingSlash(path)}`,
      requestInit
    ).then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await parser(response);
    });
  }

  private stripLeadingSlash(url: string) {
    return url.replace(/^\//, '');
  }

  private stripTrailingSlash(url: string) {
    return url.replace(/\/$/, '');
  }
}
