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
});
