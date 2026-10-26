import { User, UserFormData } from '../types';

// Simulated database (in real app, this would be PHP + MySQL)
let users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    address: '123 Main St, New York, NY',
    created_at: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 345 678 901',
    address: '456 Oak Ave, Los Angeles, CA',
    created_at: '2024-02-20 14:45:00',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 456 789 012',
    address: '789 Pine Rd, Chicago, IL',
    created_at: '2024-03-10 09:15:00',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    phone: '+1 567 890 123',
    address: '321 Elm St, Houston, TX',
    created_at: '2024-04-05 16:20:00',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    phone: '+1 678 901 234',
    address: '654 Maple Dr, Phoenix, AZ',
    created_at: '2024-05-12 11:00:00',
  },
];

let nextId = 6;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// CRUD Operations (simulating PHP API calls)
export const api = {
  // READ - GET all users
  getAll: async (): Promise<User[]> => {
    await delay(300);
    return [...users];
  },

  // READ - GET single user
  getById: async (id: number): Promise<User | undefined> => {
    await delay(200);
    return users.find(u => u.id === id);
  },

  // CREATE - POST new user
  create: async (data: UserFormData): Promise<User> => {
    await delay(400);
    const newUser: User = {
      ...data,
      id: nextId++,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    users = [...users, newUser];
    return newUser;
  },

  // UPDATE - PUT update user
  update: async (id: number, data: UserFormData): Promise<User> => {
    await delay(400);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...data };
    return users[index];
  },

  // DELETE - DELETE user
  delete: async (id: number): Promise<void> => {
    await delay(300);
    users = users.filter(u => u.id !== id);
  },
};
