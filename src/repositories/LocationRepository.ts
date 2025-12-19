import db from '../database/connection';
import { Location, CreateLocationRequest, UpdateLocationRequest } from '../types';

/**
 * Repository for managing Location data
 */
export class LocationRepository {
  private readonly tableName = 'locations';

  /**
   * Find all locations with optional pagination
   */
  async findAll(limit = 100, offset = 0): Promise<Location[]> {
    return db(this.tableName).select('*').limit(limit).offset(offset);
  }

  /**
   * Find location by ID
   */
  async findById(id: number): Promise<Location | undefined> {
    const location = await db(this.tableName).where({ id }).first();
    return location;
  }

  /**
   * Find all locations for a given address
   * Excellent: Proper relationship query
   */
  async findByAddressId(addressId: number): Promise<Location[]> {
    return db(this.tableName).where({ address_id: addressId }).select('*');
  }

  /**
   * Create a new location
   */
  async create(data: CreateLocationRequest): Promise<Location> {
    const [location] = await db(this.tableName)
      .insert({
        address_id: data.address_id,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        is_active: data.is_active !== undefined ? data.is_active : true,
      })
      .returning('*');

    return location;
  }

  /**
   * Update an existing location
   */
  async update(id: number, data: UpdateLocationRequest): Promise<Location | undefined> {
    const [location] = await db(this.tableName)
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');

    return location;
  }

  /**
   * Delete a location by ID
   */
  async delete(id: number): Promise<boolean> {
    const deleted = await db(this.tableName).where({ id }).delete();
    return deleted > 0;
  }

  /**
   * Find active locations within a bounding box
   * Excellent: Complex geographical query
   */
  async findInBoundingBox(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
  ): Promise<Location[]> {
    return db(this.tableName)
      .where('is_active', true)
      .whereBetween('latitude', [minLat, maxLat])
      .whereBetween('longitude', [minLon, maxLon])
      .select('*');
  }

  /**
   * Get location count for an address
   */
  async countByAddressId(addressId: number): Promise<number> {
    const result = await db(this.tableName)
      .where({ address_id: addressId })
      .count('id as count')
      .first();

    return result ? Number(result.count) : 0;
  }
}
