class EnvironmentService {
  private cache: Map<string, string> = new Map();

  get(key: string): string {
    if (this.cache.has(key)) {
      return this.cache.get(key) as string;
    }

    this.cache.set(key, process.env[key] as string);

    return this.cache.get(key) as string;
  }
}

// Export singleton instance
export const environmentService = new EnvironmentService();
