import db from './db.ts';
import { fetch } from './fetch.ts';
import type { Task } from './types.ts';

const executeTask = async (task: Task): Promise<void> => {
  // simulate task execution, just sleep for the specified time
  await new Promise((resolve) => setTimeout(resolve, task.payload.sleep));
};

while (true) {
  const task: Task = await fetch();

  if (!task) {
    console.log('No tasks, sleeping for 2 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    continue;
  }

  await executeTask(task);

  await db('tasks')
    .update({ status: 'done', executed_at: db.fn.now() })
    .where({ id: task.id });
  console.log('Task done:', task.id);
}
