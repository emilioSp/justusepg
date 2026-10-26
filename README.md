# Just Use Postgres

**Why add another dependency when PostgreSQL can be your queue?**

This project demonstrates how ridiculously simple it is to build a **production-ready work queue** using just PostgreSQL.

No Redis, no RabbitMQ, no SQS—just Postgres.

![Descrizione](./justusepg.gif)

## Why did I write this?

Because simplicity is underrated.

You don't need to introduce more moving parts into your architecture when your database can handle it all.

## The Magic: One SQL Query

```sql
SELECT * FROM tasks 
WHERE status = 'pending' 
ORDER BY created_at 
FOR UPDATE SKIP LOCKED 
LIMIT 1
```

That's it. `FOR UPDATE SKIP LOCKED` ensures multiple workers can safely process tasks concurrently without stepping on each other's toes.

It's basic, reliable, and leverages PostgreSQL's robust ACID guarantees.

It's already in your stack, battle-tested, you just have to use it.

## Software components

### 1. DB Schema
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  picked_at TIMESTAMP,
  executed_at TIMESTAMP
);
```

### 2. Producer (Add Tasks)
Continuously adds tasks to the queue.

### 3. Consumers (Process Tasks)
Workers that process tasks in parallel—all safely thanks to PostgreSQL's locking mechanism.

## Retry Logic as supported by queue systems

Tasks that fail aren't lost. They're automatically retried, again just using plain Postgres columns.

```sql
ALTER TABLE tasks ADD COLUMN retry_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tasks ADD COLUMN max_attempts INTEGER NOT NULL DEFAULT 3;
ALTER TABLE tasks ADD COLUMN error_message TEXT;
```

When a worker fails to process a task:
- If `retry_count` is still below `max_attempts`, the task is put back to `pending` (so another worker can pick it up), `retry_count` is incremented, and `error_message` is recorded.
- Once `retry_count` reaches `max_attempts`, the task is marked `failed` for good, keeping the last `error_message` for debugging.

```ts
if (newRetryCount >= task.max_attempts) {
  // give up: status = 'failed'
} else {
  // try again: status = 'pending', picked_at = null
}
```

## Quick Start

```bash
# Start PostgreSQL
docker compose up -d

# Run migrations
npm run migrate

# Let's the party begin
npm run start
```

Watch as multiple workers process different tasks simultaneously without any race conditions.
Each producer is able to fetch one task at a time, process it, and mark it as done.
A task is never processed more than once.
A task is never assigned to more than one worker at a time.

## What This Proves

You don't always need specialized queue infrastructure. PostgreSQL is:
- **Simple** - Already in your stack
- **Reliable** - Battle-tested ACID guarantees
- **Performant** - Handles thousands of jobs/second
- **Cost-effective** - No additional services to pay for

and hey, you don't need to consume a "message" to see its payload! :D (just query the `tasks` table directly!)

## When NOT to Use This

- You need **millions** of messages per second
- You need **pub/sub** patterns across many many...many services
- You need **delayed/scheduled** jobs at scale

But for **80% of use cases**? Just use Postgres.

## Tech Stack

- PostgreSQL (with `SKIP LOCKED`)
- Node.js + TypeScript
- Knex.js (query builder)
- Docker Compose

---

**The best queue is the one you don't have to add.** 🚀
