export interface SessionUser {
  userId: string;
  email: string;
  role: string;
}

export interface Child {
  name: string;
  age: number;
  specialNeeds?: string;
}

export interface Reference {
  name: string;
  phone: string;
  relation: string;
}

export interface Availability {
  [day: string]: string[];
}

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}
