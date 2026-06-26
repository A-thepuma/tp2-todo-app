export interface TaskItemData {
  id: string; // Et non 'number'
  title: string;
  description?: string;
  date: string;
  completed: boolean;
}