import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('locations', (table) => {
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
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('locations');
}
