import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// Determine if we're running from compiled code (dist) or source
const isCompiled = __dirname.includes('/dist');
const projectRoot = isCompiled ? path.join(__dirname, '..') : __dirname;
const migrationsDir = isCompiled 
  ? path.join(__dirname, 'src', 'database', 'migrations')
  : path.join(__dirname, 'src', 'database', 'migrations');

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: process.env.DB_PATH || path.join(projectRoot, 'data', 'addresses_dev.db'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
  },
  test: {
    client: 'better-sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
  },
  production: {
    client: 'better-sqlite3',
    connection: {
      filename: process.env.DB_PATH || path.join(projectRoot, 'data', 'addresses_prod.db'),
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: migrationsDir,
      extension: 'js',
    },
  },
};

export default config;
