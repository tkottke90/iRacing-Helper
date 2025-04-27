import { QueryInterface } from '../interfaces/database';

export class QueryBuilder {
  protected statements: string[] = [];
  protected params: Record<string, any> = {};

  constructor(nodeVar: string, query: QueryInterface<unknown>) {
    if (query.where) {
      for (const [key, value] of Object.entries(query.where)) {
        this.statements.push(`${nodeVar}.${key} = $${key}`);
        this.params[key] = value;
      }
    }
  }

  build() {
    const query = this.statements.join(' AND ');
    return { query, params: this.params };
  }
}

export class Neo4jQueryBuilder extends QueryBuilder {
  private readonly operator: 'MATCH' | 'MERGE' | 'CREATE' | 'DELETE' = 'MATCH';
  private readonly nodeVar: string = 'n';
  private readonly label: string = '';

  constructor(label = '') {
    super('n', {});

    this.label = label;
  }

  build() {
    const queryStr = [
      /* Operator which dictates which command to run */
      this.operator,
      /* Node variable and label */
      `(${this.nodeVar}${this.label ? `:${this.label}` : ''})`,
      'RETURN',
      this.nodeVar
    ].join(' ');

    const query = this.statements.join(' AND ');
    return { query, params: this.params };
  }

  buildNodeReference(
    nodeVar: string,
    label = '',
    properties: Record<string, string | number | boolean | null> = {}
  ) {
    return [
      '(',
      nodeVar,
      label ? `:${label} ` : ' ',
      properties ? ` {${Object.entries(properties).join(', ')}}` : '',
      ')'
    ].join('');
  }
}
