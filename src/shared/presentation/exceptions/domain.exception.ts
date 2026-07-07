export class DomainException extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly details?: unknown,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'DomainException';
  }

  protected static buildErrorCode({
    module,
    resource,
    errorType,
  }: {
    module: string;
    resource: string;
    errorType: string;
  }) {
    return `${module}__${resource}__${errorType}`;
  }

  protected static parseErrorCode(code: string) {
    const [module, resource, errorType] = code.split('__');
    return { module, resource, errorType };
  }
}
