import { beforeAll, afterAll } from 'vitest';
import db from '../src/database/connection';

/**
 * Setup test database with schema
 * This manually creates the schema instead of using migrations
 * to avoid TypeScript loading issues with Knex migrations
 */
beforeAll(async () => {
  // Create addresses table
  await db.schema.createTable('addresses', (table) => {
    table.increments('id').primary();
    table.string('street', 255).notNullable();
    table.string('city', 100).notNullable();
    table.string('state', 50).notNullable();
    table.string('zip_code', 20).notNullable();
    table.string('country', 100).notNullable().defaultTo('USA');
    table.timestamps(true, true);
  });

  // Create locations table
  await db.schema.createTable('locations', (table) => {
    table.increments('id').primary();
    table.integer('address_id').unsigned().notNullable();
    table.string('name', 255).notNullable();
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.text('description');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    table.foreign('address_id').references('id').inTable('addresses').onDelete('CASCADE');
    table.index(['address_id']);
    table.index(['is_active']);
  });
});

afterAll(async () => {
  await db.destroy();
});
