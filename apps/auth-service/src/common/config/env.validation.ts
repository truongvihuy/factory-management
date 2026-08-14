import Joi from 'joi';

export const envValidationSchema = Joi.object({
  APP_NAME: Joi.string().default('fms-auth-service'),

  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),

  PORT: Joi.number().port().default(3001),

  AUTH_MAX_LOGIN_ATTEMPTS: Joi.number().integer().min(1).max(20).default(5),

  AUTH_FAILURE_WINDOWN_SECONDS: Joi.number().integer().min(1).max(86_400).default(500),

  AUTH_LOCK_DURATION_MINUTES: Joi.number().integer().min(1).max(1440).default(15),

  JWT_SECRET: Joi.string().required(),

  JWT_ISSUER: Joi.string().min(1).max(200).default('fms-auth-service'),

  JWT_AUDIENCE: Joi.string().min(1).max(200).default('fms'),

  JWT_ACCESS_TOKEN_TTL: Joi.number().integer().min(60).max(86400).default(900),

  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),

  REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .required(),

  GRPC_HOST: Joi.string().default('0.0.0.0'),

  GRPC_PORT: Joi.number().port().default(5001),

  RABBITMQ_URL: Joi.string()
    .uri({
      scheme: ['amqp', 'amqps'],
    })
    .required(),
});
