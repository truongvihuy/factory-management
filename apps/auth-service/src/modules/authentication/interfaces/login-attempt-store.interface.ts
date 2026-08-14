export interface LoginAttemptStore {
  getAttempts(userId: string): Promise<number>;

  incrementAttempts(userId: string): Promise<number>;

  resetAttempts(userId: string): Promise<void>;

  getTtl(userId: string): Promise<number>;
}
