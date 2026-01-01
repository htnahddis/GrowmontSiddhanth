export interface Employee {
  id: string;
  name: string;
  department: string;
  level: 'Junior' | 'Middle' | 'Senior';
  avatar: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

export interface ProductSale {
  id: string;
  clientName: string;
  type: string;
  amount: number;
  category: number;
  createdDate: string;
  priority: 'Low' | 'Medium' | 'High';
  representatives: string[];
}