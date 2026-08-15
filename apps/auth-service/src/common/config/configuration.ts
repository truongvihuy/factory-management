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
      maxLoginAttempts: Number(process.env.AUTH_MAX_LOGIN_ATTEMPTS),
      failureWindowSeconds: Number(process.env.AUTH_FAILURE_WINDOWN_SECONDS),
      lockDurationMinutes: Number(process.env.AUTH_LOCK_DURATION_MINUTES),
    },

    token: {
      secret: process.env.JWT_SECRET,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      accessTokenTtlSeconds: Number(process.env.JWT_ACCESS_TOKEN_TTL),
    },

    password: {
      memoryCost: Number(process.env.PASSWORD_MEMORY_COST),
      timeCost: Number(process.env.PASSWORD_TIME_COST),
      parallelism: Number(process.env.PASSWORD_PARALLELISM_COST),
    },
  },
});
