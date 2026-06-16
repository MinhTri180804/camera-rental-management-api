export class InfrastructureException extends Error {
  constructor(
    public readonly code: string | number,
    public readonly message: string,
    public readonly provider: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'InfrastructureException';
  }
}
