export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'fms-auth-service',
    environment: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3001),
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    url: process.env.REDIS_URL,
  },

  grpc: {
    host: process.env.GRPC_HOST ?? '0.0.0.0',
    port: Number(process.env.GRPC_PORT ?? 5001),
  },

  messaging: {
    url: process.env.RABBITMQ_URL,
  },
});
