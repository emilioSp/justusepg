export type Payload = {
  sleep: number;
};

export type Task = {
  id: number;
  payload: Payload;
  status: 'pending' | 'in_progress' | 'done';
  created_at: string;
  updated_at: string;
};
