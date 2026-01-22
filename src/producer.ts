import db from './db.ts';
import type { Payload, Task } from './types.ts';

await db('tasks').truncate();

while (true) {
  const payload: Payload = {
    sleep: Math.random() * Number(process.env.CONSUMER_MAX_SLEEP_TIME_MS!),
  };

  const row: Task = await db('tasks').insert(
    {
      payload: JSON.stringify(payload),
      status: 'pending',
    },
    ['*'],
  );

  console.log('Task created:', row[0].payload);
  await new Promise((resolve) =>
    setTimeout(resolve, Number(process.env.PRODUCER_SLEEP_TIME_MS!)),
  );
}
