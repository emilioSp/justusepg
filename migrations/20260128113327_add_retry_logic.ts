import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add retry columns
  await knex.raw(
    `ALTER TABLE tasks ADD COLUMN retry_count INTEGER NOT NULL DEFAULT 0;`,
  );
  await knex.raw(
    `ALTER TABLE tasks ADD COLUMN max_retries INTEGER NOT NULL DEFAULT 3;`,
  );
  await knex.raw(`ALTER TABLE tasks ADD COLUMN error_message TEXT;`);

  await knex.raw(`ALTER TYPE t_status ADD VALUE IF NOT EXISTS 'failed';`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE tasks DROP COLUMN retry_count;`);
  await knex.raw(`ALTER TABLE tasks DROP COLUMN max_retries;`);
  await knex.raw(`ALTER TABLE tasks DROP COLUMN error_message;`);

  // Note: PostgreSQL does not support simply removing values from enums.
  // The 'failed' value will remain in t_status; only the added columns are rolled back.
}
