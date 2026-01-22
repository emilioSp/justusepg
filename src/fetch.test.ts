import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, test } from 'node:test';

import db from './db.ts';
import { fetch } from './fetch.ts';

beforeEach(async () => {
  await db('tasks').truncate();
  const tasks = Array.from({ length: 100 }, () => ({
    payload: JSON.stringify({ sleep: 1000 }),
    status: 'pending',
  }));
  await db('tasks').insert(tasks);
});

afterEach(async () => {
  await db('tasks').truncate();
  db.destroy();
});

test('fetch locking mechanism', async () => {
  const promises = [];
  for (let i = 0; i < 100; i++) {
    promises.push(fetch());
  }

  const tasks = await Promise.all(promises);

  const uniqueIds = new Set(tasks.map((task) => task?.id));
  assert.deepStrictEqual(uniqueIds.size, 100);
});
