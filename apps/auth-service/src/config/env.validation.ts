import Joi from 'joi';

export const envValidationSchema = Joi.object({
  APP_NAME: Joi.string().default('fms-auth-service'),

  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),

  PORT: Joi.number().port().default(3001),

  DATABASE_URL: Joi.string().uri().required(),

  REDIS_URL: Joi.string().uri().required(),

  GRPC_HOST: Joi.string().default('0.0.0.0'),

  GRPC_PORT: Joi.number().port().default(5001),

  RABBITMQ_URL: Joi.string().uri().required(),
});
