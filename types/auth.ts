export interface User {
  email: string;
  username: string | null;
  fullName?: string;
  avatar?: string;
}

export interface UserPreferences {
  showContractors: boolean;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
}
