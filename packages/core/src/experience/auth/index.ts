export interface AuthSession {
  id: string;
  exp: number;
  fullName: string;
  email: string;
  profilePicture?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>; // Custom data
}
