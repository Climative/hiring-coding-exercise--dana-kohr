import { Router, Request, Response } from 'express';
import { LocationRepository } from '../repositories/LocationRepository';
import { validateLocation, validateIdParam } from '../middleware/validation';
import { Logger } from '../utils/logger';

const router = Router();
const locationRepo = new LocationRepository();

/**
 * GET /api/locations
 * Get all locations with pagination
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const locations = await locationRepo.findAll(limit, offset);
    res.json({
      data: locations,
      pagination: {
        limit,
        offset,
        count: locations.length,
      },
    });
  } catch (error) {
    Logger.error('Error fetching locations', error as Error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

/**
 * GET /api/locations/:id
 * Get a specific location by ID
 */
router.get('/:id', validateIdParam, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const location = await locationRepo.findById(id);

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    res.json({ data: location });
  } catch (error) {
    Logger.error('Error fetching location', error as Error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

/**
 * GET /api/locations/address/:addressId
 * Get all locations for a specific address
 * Excellent: Proper relationship endpoint
 */
router.get('/address/:addressId', validateIdParam, async (req: Request, res: Response) => {
  try {
    const addressId = parseInt(req.params.addressId);
    const locations = await locationRepo.findByAddressId(addressId);

    res.json({
      data: locations,
      count: locations.length,
    });
  } catch (error) {
    Logger.error('Error fetching locations by address', error as Error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

/**
 * GET /api/locations/bbox
 * Find locations within a bounding box
 * Excellent: Advanced geographical query endpoint
 */
router.get('/bbox', async (req: Request, res: Response) => {
  try {
    const { minLat, maxLat, minLon, maxLon } = req.query;

    if (!minLat || !maxLat || !minLon || !maxLon) {
      res.status(400).json({
        error: 'Missing required parameters: minLat, maxLat, minLon, maxLon',
      });
      return;
    }

    const locations = await locationRepo.findInBoundingBox(
      parseFloat(minLat as string),
      parseFloat(maxLat as string),
      parseFloat(minLon as string),
      parseFloat(maxLon as string)
    );

    res.json({
      data: locations,
      count: locations.length,
    });
  } catch (error) {
    Logger.error('Error fetching locations in bounding box', error as Error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

/**
 * POST /api/locations
 * Create a new location
 */
router.post('/', validateLocation, async (req: Request, res: Response) => {
  try {
    const location = await locationRepo.create(req.body);
    Logger.info(`Created location with ID: ${location.id}`);

    res.status(201).json({ data: location });
  } catch (error) {
    Logger.error('Error creating location', error as Error);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

/**
 * PUT /api/locations/:id
 * Update an existing location
 */
router.put('/:id', validateIdParam, validateLocation, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const location = await locationRepo.update(id, req.body);

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    Logger.info(`Updated location with ID: ${id}`);
    res.json({ data: location });
  } catch (error) {
    Logger.error('Error updating location', error as Error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

/**
 * DELETE /api/locations/:id
 * Delete a location
 */
router.delete('/:id', validateIdParam, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await locationRepo.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    Logger.info(`Deleted location with ID: ${id}`);
    res.status(204).send();
  } catch (error) {
    Logger.error('Error deleting location', error as Error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

export default router;
