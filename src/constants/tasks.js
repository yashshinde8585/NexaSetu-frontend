// Lists the standard lifecycle states that a task can be assigned.
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const TASK_TYPE = {
  EPIC: 'epic',
  STORY: 'story',
  TASK: 'task',
  BUG: 'bug',
  SPIKE: 'spike',
  TECH_DEBT: 'tech_debt',
};
