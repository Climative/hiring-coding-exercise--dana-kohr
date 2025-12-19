import db from '../database/connection';
import { Address, CreateAddressRequest, UpdateAddressRequest } from '../types';

/**
 * Repository for managing Address data
 * This is an example of well-structured data access layer
 */
export class AddressRepository {
  private readonly tableName = 'addresses';

  /**
   * Find all addresses with optional pagination
   */
  async findAll(limit = 100, offset = 0): Promise<Address[]> {
    return db(this.tableName).select('*').limit(limit).offset(offset);
  }

  /**
   * Find address by ID
   */
  async findById(id: number): Promise<Address | undefined> {
    const address = await db(this.tableName).where({ id }).first();
    return address;
  }

  /**
   * Create a new address
   */
  async create(data: CreateAddressRequest): Promise<Address> {
    // Excellent: Using transactions for data integrity
    const [address] = await db(this.tableName)
      .insert({
        street: data.street,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        country: data.country || 'USA',
      })
      .returning('*');

    return address;
  }

  /**
   * Update an existing address
   */
  async update(id: number, data: UpdateAddressRequest): Promise<Address | undefined> {
    const [address] = await db(this.tableName)
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');

    return address;
  }

  /**
   * Delete an address by ID
   */
  async delete(id: number): Promise<boolean> {
    const deleted = await db(this.tableName).where({ id }).delete();
    return deleted > 0;
  }

  /**
   * Find addresses by city
   */
  async findByCity(city: string): Promise<Address[]> {
    return db(this.tableName).where({ city }).select('*');
  }

  /**
   * Search addresses by partial street name
   */
  async searchByStreet(streetQuery: string): Promise<Address[]> {
    return db(this.tableName)
      .where('street', 'ilike', `%${streetQuery}%`)
      .select('*');
  }

  /**
   * Increment a counter for an address (for analytics purposes)
   */
  async incrementViewCount(id: number): Promise<void> {
    // Read current value
    const address = await db(this.tableName).where({ id }).first();
    
    if (address) {
      // Simulate some processing time
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentCount = (address as any).view_count || 0;
      
      // Write back incremented value
      // Multiple concurrent requests will read the same value and increment,
      // causing lost updates
      await db(this.tableName)
        .where({ id })
        .update({ view_count: currentCount + 1 });
    }
  }

  /**
   * Transfer an address to a different owner with rollback capability
   */
  async transferOwnership(
    addressId: number,
    oldOwner: string,
    newOwner: string
  ): Promise<boolean> {
    const trx = await db.transaction();

    // eslint-disable-next-line no-useless-catch
    try {
      // Verify old owner
      const address = await trx(this.tableName).where({ id: addressId }).first();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!address || (address as any).owner !== oldOwner) {
        return false;
      }

      // Update to new owner
      await trx(this.tableName)
        .where({ id: addressId })
        .update({ owner: newOwner, updated_at: new Date() });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
