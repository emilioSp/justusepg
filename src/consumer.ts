import db from './db.ts';
import { fetch } from './fetch.ts';
import type { Task } from './types.ts';

const executeTask = async (task: Task): Promise<void> => {
  // simulate task execution, just sleep for the specified time
  // randomly fail 30% of the time to test retry logic
  if (Math.random() < 0.3) {
    throw new Error('Random failure for testing');
  }
  await new Promise((resolve) => setTimeout(resolve, task.payload.sleep));
};

while (true) {
  const task: Task = await fetch();

  if (!task) {
    console.log('No tasks, sleeping for 2 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    continue;
  }

  try {
    await executeTask(task);

    await db('tasks')
      .update({ status: 'done', executed_at: db.fn.now() })
      .where({ id: task.id });
    console.log('✅ Task done:', task.id);
  } catch (error) {
    const newRetryCount = task.retry_count + 1;

    if (newRetryCount >= task.max_attempts) {
      // Max attempts exceeded, mark as failed
      await db('tasks')
        .update({
          status: 'failed',
          retry_count: newRetryCount,
          error_message: error.message,
          executed_at: db.fn.now(),
        })
        .where({ id: task.id });

      console.log(
        `❌ Task failed permanently (${newRetryCount} failures):`,
        task.id,
      );
    } else {
      await db('tasks')
        .update({
          status: 'pending',
          retry_count: newRetryCount,
          error_message: error.message,
          picked_at: null,
        })
        .where({ id: task.id });

      console.log(
        `🔄 Task failed (failure ${newRetryCount}/${task.max_attempts}):`,
        task.id,
      );
    }
  }
}
