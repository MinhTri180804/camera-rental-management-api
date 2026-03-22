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
}
