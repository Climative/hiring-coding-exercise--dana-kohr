import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AddressRepository } from '../src/repositories/AddressRepository';
import db from '../src/database/connection';

/**
 * Sample tests to demonstrate testing approach
 * Candidates should add more comprehensive tests
 */
describe('AddressRepository', () => {
  const addressRepo = new AddressRepository();

  beforeAll(async () => {
    // Clean up any existing data before tests
    await db('addresses').del();
  });

  afterAll(async () => {
    // Clean up test data
    await db('addresses').del();
  });

  it('should create a new address', async () => {
    const addressData = {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip_code: '62701',
      country: 'USA',
    };

    const address = await addressRepo.create(addressData);

    expect(address).toBeDefined();
    expect(address.id).toBeDefined();
    expect(address.street).toBe(addressData.street);
    expect(address.city).toBe(addressData.city);
  });

  it('should find address by id', async () => {
    const addressData = {
      street: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zip_code: '62702',
    };

    const created = await addressRepo.create(addressData);
    const found = await addressRepo.findById(created.id!);

    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });

  it('should return undefined for non-existent address', async () => {
    const found = await addressRepo.findById(99999);
    expect(found).toBeUndefined();
  });
});
