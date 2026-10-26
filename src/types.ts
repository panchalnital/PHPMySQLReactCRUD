export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export type UserFormData = Omit<User, 'id' | 'created_at'>;
