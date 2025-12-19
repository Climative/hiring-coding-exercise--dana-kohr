import { Router, Request, Response } from 'express';
import { AddressRepository } from '../repositories/AddressRepository';
import { validateAddress, validateIdParam } from '../middleware/validation';
import { Logger } from '../utils/logger';

const router = Router();
const addressRepo = new AddressRepository();

/**
 * GET /api/addresses
 * Get all addresses with pagination
 * Excellent: Clean route handler with proper error handling
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    Logger.info(`Fetching addresses with limit=${limit}, offset=${offset}`);

    const addresses = await addressRepo.findAll(limit, offset);
    res.json({
      data: addresses,
      pagination: {
        limit,
        offset,
        count: addresses.length,
      },
    });
  } catch (error) {
    Logger.error('Error fetching addresses', error as Error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

/**
 * GET /api/addresses/:id
 * Get a specific address by ID
 */
router.get('/:id', validateIdParam, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const address = await addressRepo.findById(id);

    if (!address) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    res.json({ data: address });
  } catch (error) {
    Logger.error('Error fetching address', error as Error);
    res.status(500).json({ error: 'Failed to fetch address' });
  }
});

/**
 * GET /api/addresses/city/:city
 * Get addresses by city
 */
router.get('/city/:city', async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    const addresses = await addressRepo.findByCity(city);

    res.json({
      data: addresses,
      count: addresses.length,
    });
  } catch (error) {
    Logger.error('Error fetching addresses by city', error as Error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

/**
 * GET /api/addresses/search
 * Search addresses by street name
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const addresses = await addressRepo.searchByStreet(query);
    res.json({
      data: addresses,
      count: addresses.length,
    });
  } catch (error) {
    Logger.error('Error searching addresses', error as Error);
    res.status(500).json({ error: 'Failed to search addresses' });
  }
});

/**
 * POST /api/addresses
 * Create a new address
 */
router.post('/', validateAddress, async (req: Request, res: Response) => {
  try {
    const address = await addressRepo.create(req.body);
    Logger.info(`Created address with ID: ${address.id}`);

    res.status(201).json({ data: address });
  } catch (error) {
    Logger.error('Error creating address', error as Error);
    res.status(500).json({ error: 'Failed to create address' });
  }
});

/**
 * PUT /api/addresses/:id
 * Update an existing address
 */
router.put('/:id', validateIdParam, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const address = await addressRepo.update(id, req.body);

    if (!address) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    Logger.info(`Updated address with ID: ${id}`);
    res.json({ data: address });
  } catch (error) {
    Logger.error('Error updating address', error as Error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

/**
 * DELETE /api/addresses/:id
 * Delete an address
 */
router.delete('/:id', validateIdParam, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await addressRepo.delete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    Logger.info(`Deleted address with ID: ${id}`);
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    Logger.error('Error deleting address', error as Error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

export default router;
