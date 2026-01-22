import db from './db.ts';
import type { Task } from './types.ts';

export const fetch = async (): Promise<Task | null> => {
  const trx = await db.transaction();
  try {
    const rows = await trx('tasks')
      .select<Task[]>('*')
      .forUpdate()
      .skipLocked()
      .where({ status: 'pending' })
      .orderBy('created_at', 'asc')
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    await trx('tasks')
      .update({
        status: 'in_progress',
        picked_at: db.fn.now(),
      })
      .where({ id: rows[0].id });

    await trx.commit();

    return rows[0];
  } catch (error) {
    await trx.rollback();
    console.error('Error fetching task:', error);
  }
};
