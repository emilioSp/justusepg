import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add retry columns
  await knex.raw(
    `ALTER TABLE tasks ADD COLUMN retry_count INTEGER NOT NULL DEFAULT 0;`,
  );
  await knex.raw(
    `ALTER TABLE tasks ADD COLUMN max_attempts INTEGER NOT NULL DEFAULT 3;`,
  );
  await knex.raw(`ALTER TABLE tasks ADD COLUMN error_message TEXT;`);

  await knex.raw(`ALTER TYPE t_status ADD VALUE 'failed';`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE tasks DROP COLUMN retry_count;`);
  await knex.raw(`ALTER TABLE tasks DROP COLUMN max_attempts;`);
  await knex.raw(`ALTER TABLE tasks DROP COLUMN error_message;`);

  // Note: PostgreSQL doesn't support removing values from enums easily
  // The 'failed' value will remain in t_status enum, only the added columns are rolled back
}
