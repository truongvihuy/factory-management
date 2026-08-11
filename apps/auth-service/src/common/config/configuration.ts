export default () => ({
  app: {
    name: process.env.APP_NAME,
    environment: process.env.NODE_ENV,
    port: Number(process.env.PORT),
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    url: process.env.REDIS_URL,
  },

  grpc: {
    host: process.env.GRPC_HOST,
    port: Number(process.env.GRPC_PORT),
  },

  messaging: {
    url: process.env.RABBITMQ_URL,
  },

  authentication: {
    security: {
      maxLoginAttempts: Number(process.env.AUTH_MAX_LOGIN_ATTEMPTS ?? 5),
      lockDurationMinutes: Number(process.env.AUTH_LOCK_DURATION_MINUTES ?? 15),
    },

    token: {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      accessTokenTtlSeconds: Number(process.env.JWT_ACCESS_TOKEN_TTL),
    },
  },
});
