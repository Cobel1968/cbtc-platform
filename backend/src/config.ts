import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development'
};

if (!config.jwtSecret || config.jwtSecret === 'fallback-secret') {
  console.warn('⚠️  JWT_SECRET non configuré. Utilisez une valeur sécurisée en production.');
}

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL est requis');
}
