# justusepg
Just use postgres

### **Coding Challenge: Implement a Work Queue with PostgreSQL**

#### **Objective**
Build a **work queue** using PostgreSQL and Node.js. Your implementation should support multiple producers and consumers, ensuring that each task in the queue is processed exactly once.

---

#### **Requirements**
1. **PostgreSQL Table**:
   - Create a table `tasks` with the following structure:
     - `id`: Unique identifier for the task (**Primary Key**).
     - `payload`: Generic content for the task (use a JSON field).
     - `status`: Task status (`pending`, `in_progress`, `done`).
     - `created_at`: Timestamp of task creation.
     - `picked_at`: Timestamp of when the task was picked up for processing.

2. **Producer**:
   - Write a **Node.js function** to add new tasks to the `tasks` table with an initial status of `pending`.
   - Simulate adding 5 tasks with different payloads.

3. **Consumers**:
   - Implement **2 concurrent worker processes** in Node.js:
     - Each worker retrieves the next `pending` task and updates its status to `in_progress`.
     - Simulate the processing of the task with a delay (e.g., 2 seconds).
     - On successful completion, update the task’s status to `done`.

4. **Queue Status**:
   - Provide a query to return the queue status, showing:
     - The number of tasks `pending`.
     - The number of tasks `in_progress`.
     - The number of tasks `done`.

---

#### **Bonus**
Make the challenge even more challenging:
- Handle **failed tasks**: Introduce a `failed` status and simulate failure handling for a task.
- Make the queue **reactive**: Use PostgreSQL **LISTEN/NOTIFY** to notify workers when new tasks are added, instead of polling.

---

#### **Deliverables**
- A SQL script (`schema.sql`) to create the `tasks` table.
- A Node.js application:
  - `producer.js`: To add tasks to the queue.
  - `consumer.js`: To process tasks in parallel.
- Instructions on how to run the producer and consumer processes.

---

Good luck! Let me know if you need help along the way. 🚀
