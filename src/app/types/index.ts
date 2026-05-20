export interface User {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export interface TerminalCommand {
  command: string;
}

export interface TerminalResponse {
  output?: string;
  result?: string;
  error?: string;
}

export interface NanoFile {
  filename?: string;
  content?: string;
}
