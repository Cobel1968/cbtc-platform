// server.js - CBTC Backend Excellence - Abel Coulibaly
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Import existing JavaScript routes
import categoryRoutes from './routes/categories.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

// Pour Railway/NGINX proxies
app.set('trust proxy', 1);

// CORS dynamique et sécurisé
const rawOrigins =
  process.env.ALLOWED_ORIGINS ||
  process.env.CORS_ORIGIN ||
  process.env.FRONTEND_URL ||
  'http://localhost:3000';
const allowedList = rawOrigins.split(',').map(s => s.trim());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman/cURL
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (allowedList.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin not allowed → ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept','Origin'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate Limiting (seulement en prod)
if (isProd) {
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes/IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Trop de requêtes, réessayez plus tard.' }
  }));
}

// Sécurité et performances
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(cookieParser());

// Parseurs
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Headers personnalisés
app.use((req, res, next) => {
  res.setHeader('X-CBTC-Version', '1.0.0');
  res.setHeader('X-CBTC-Author', 'Abel Coulibaly');
  next();
});

// Route de santé - Health Check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    service: 'cbtc-backend',
    env: NODE_ENV,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Racine - Accueil API
app.get('/', (_req, res) => {
  res.json({
    message: 'CBTC API - Cobel Business Training Center',
    status: 'active',
    entrepreneur: 'Abel Coulibaly',
    vision: "L'excellence entrepreneuriale à portée de tous"
  });
});

// Mount API routes
app.use('/api/categories', categoryRoutes);

// Simple auth endpoints for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple test authentication
  if (email === 'test@cbtc.com' && password === 'testpass123') {
    const token = 'demo-token-' + Date.now();
    res.json({
      message: 'Connexion réussie',
      user: { id: 1, email, name: 'Test User CBTC', role: 'USER' },
      token
    });
  } else {
    res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token || !token.startsWith('demo-token-')) {
    return res.status(401).json({ error: 'Token requis' });
  }
  
  res.json({
    user: { id: 1, email: 'test@cbtc.com', name: 'Test User CBTC', role: 'USER' }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Déconnexion réussie' });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée dans la symphonie CBTC',
    requested_path: req.originalUrl
  });
});

// Gestion globale des erreurs
app.use((err, _req, res, _next) => {
  console.error('❌ CBTC Error:', err.message);
  const status = err.message?.startsWith('CORS') ? 403 : 500;
  res.status(status).json({
    error: status === 403 ? 'CORS Error' : 'Erreur interne du serveur CBTC',
    message: NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage et arrêt gracieux
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ═══════════════════════════════════════════════════════════════');
  console.log(`🌟 SERVEUR CBTC EXCELLENCE DÉMARRÉ sur http://localhost:${PORT}`);
  console.log(`🌍 Environnement: ${NODE_ENV}`);
  console.log(`🔐 CORS autorisé: ${allowedList.join(', ')} + *.vercel.app`);
  console.log('🚀 ═══════════════════════════════════════════════════════════════');
});

const gracefulShutdown = (signal) => {
  console.log(`\n📴 Signal ${signal} reçu - Arrêt gracieux CBTC...`);
  server.close((err) => {
    if (err) {
      console.error('❌ Erreur lors de l\'arrêt:', err);
      process.exit(1);
    }
    console.log('✅ Serveur CBTC arrêté proprement');
    process.exit(0);
  });
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
