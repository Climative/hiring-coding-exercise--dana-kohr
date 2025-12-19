import { Request, Response, NextFunction } from 'express';

/**
 * Excellent: Input validation middleware
 */
export const validateAddress = (req: Request, res: Response, next: NextFunction): void => {
  const { street, city, state, zip_code } = req.body;

  if (!street || typeof street !== 'string' || street.trim().length === 0) {
    res.status(400).json({ error: 'Street is required and must be a non-empty string' });
    return;
  }

  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    res.status(400).json({ error: 'City is required and must be a non-empty string' });
    return;
  }

  if (!state || typeof state !== 'string' || state.trim().length === 0) {
    res.status(400).json({ error: 'State is required and must be a non-empty string' });
    return;
  }

  if (!zip_code) {
    res.status(400).json({ error: 'Zip code is required' });
    return;
  }

  next();
};

/**
 * Validate location creation/update
 */
export const validateLocation = (req: Request, res: Response, next: NextFunction): void => {
  const { address_id, name, latitude, longitude } = req.body;

  if (req.method === 'POST') {
    if (!address_id || typeof address_id !== 'number') {
      res.status(400).json({ error: 'Address ID is required and must be a number' });
      return;
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Name is required and must be a non-empty string' });
      return;
    }
  }

  // Validate latitude range if provided
  if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
    res.status(400).json({ error: 'Latitude must be between -90 and 90' });
    return;
  }

  if (longitude !== undefined && (longitude < -90 || longitude > 90)) {
    res.status(400).json({ error: 'Longitude must be between -90 and 90' });
    return;
  }

  next();
};

/**
 * Excellent: Validate ID parameter middleware
 */
export const validateIdParam = (req: Request, res: Response, next: NextFunction): void => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid ID parameter' });
    return;
  }

  // Attach parsed ID to request for use in route handlers
  req.params.id = id.toString();
  next();
};
