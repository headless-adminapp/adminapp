export interface AuthSession {
  id: string;
  exp: number;
  fullName: string;
  email: string;
  profilePicture?: string;
  data?: Record<string, any>; // Custom data
}
