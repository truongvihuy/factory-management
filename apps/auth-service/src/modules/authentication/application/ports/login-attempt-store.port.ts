export interface LoginAttemptStorePort {
  getFailedAttempts(userId: string): Promise<number>;

  incrementFailedAttempts(userId: string): Promise<number>;

  resetFailedAttempts(userId: string): Promise<void>;

  getTtl(userId: string): Promise<number>;
}
