import { Request, Response, NextFunction } from 'express';

/**
 * Excellent: Centralized error handling middleware
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  console.error('Error:', err);

  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message, // Should be hidden in production
    stack: isDevelopment ? err.stack : undefined,
  });
};
