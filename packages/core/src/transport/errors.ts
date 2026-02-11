export class HttpError extends Error {
  public status: number;
  public code?: string;

  /**
   * Creates an instance of HttpError.
   * @param status HTTP Status code for network response
   * @param message Error message
   * @param code Optional error code string
   */
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, code?: string) {
    super(400, message, code || 'BAD_REQUEST');
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string, code?: string) {
    super(401, message, code || 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string, code?: string) {
    super(403, message, code || 'FORBIDDEN');
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, code?: string) {
    super(404, message, code || 'NOT_FOUND');
  }
}

export class ConflictError extends HttpError {
  constructor(message: string, code?: string) {
    super(409, message, code || 'CONFLICT');
  }
}

export function isHttpError(error: unknown): error is HttpError {
  if (error instanceof HttpError) {
    return true;
  }

  if (
    typeof error === 'object' &&
    !!error &&
    'status' in error &&
    typeof error.status === 'number' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return true;
  }

  return false;
}
