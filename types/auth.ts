export interface User {
  id: string;
  email: string;
  username?: string;
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
