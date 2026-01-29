import { TaskStatus } from 'src/common/types/enums/task-status.enum';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
