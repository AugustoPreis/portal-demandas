export class RequestError extends Error {
  code: number;

  constructor(code?: number, message?: string) {
    super(message);

    this.code = code;
  }

  format(): string {
    const { code, message } = this;

    return `${code} - ${message}`;
  }
}