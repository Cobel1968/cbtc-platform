"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
    databaseUrl: process.env.DATABASE_URL,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
};
if (!exports.config.jwtSecret || exports.config.jwtSecret === 'fallback-secret') {
    console.warn('⚠️  JWT_SECRET non configuré. Utilisez une valeur sécurisée en production.');
}
if (!exports.config.databaseUrl) {
    throw new Error('DATABASE_URL est requis');
}
//# sourceMappingURL=config.js.map