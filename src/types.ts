export type Payload = {
  sleep: number;
};

export type Task = {
  id: string;
  payload: Payload;
  status: 'pending' | 'in_progress' | 'done' | 'failed';
  retry_count: number;
  max_attempts: number;
  error_message: string | null;
  created_at: string;
  picked_at: string | null;
  executed_at: string | null;
};
