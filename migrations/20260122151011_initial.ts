import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

  await knex.raw(`
    CREATE TYPE t_status AS ENUM ('pending', 'in_progress', 'done');
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      payload JSONB NOT NULL,
      status t_status NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      picked_at TIMESTAMP,
      executed_at TIMESTAMP
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TYPE IF EXISTS t_status;');
  await knex.raw(`DROP TABLE IF EXISTS tasks;`);
}
