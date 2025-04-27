export interface McpSchema {
  type: string;
  description: string;

  version?: string;
  properties?: Record<string, any>;
}

export interface MCPResource<T> {
  metadata: {
    schema: McpSchema;
    links: {
      description: string;
      rel: string;
      href: string;
    }[];
  };
  data: T[];
}
