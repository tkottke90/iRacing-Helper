import { loggerService } from './logger.service';
import { MCPResource, McpSchema } from '../interfaces/model-context-protocol';

class MCPService {
  private readonly logger = loggerService;

  /**
   * Creates a Model Context Protocol resource
   *
   * @template T - The type of data being wrapped in the MCP resource
   * @param data - The data to include in the resource
   * @param schema - The schema information for the resource
   * @param links - Links related to the resource
   * @returns An MCP-formatted resource
   */
  createResource<T>(
    data: T[],
    schema: McpSchema,
    links: Array<{ description: string; rel: string; href: string }>
  ): MCPResource<T> {
    this.logger.log('debug', 'Creating MCP resource', {
      schema: schema.type,
      dataCount: data.length
    });

    return {
      metadata: {
        schema,
        links
      },
      data
    };
  }
}

// Export singleton instance
export const mcpService = new MCPService();
