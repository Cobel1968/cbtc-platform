import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import process from 'node:process';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Configuration flexible et sécurisée
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL]
  : ['*'];

app.use(cors({
  origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Sécurité et performances
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parseurs JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Route de santé - Essentielle pour Railway
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    service: 'cbtc-backend',
    env: process.env.NODE_ENV || 'development',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Route racine - Message d'accueil
app.get('/', (req, res) => {
  res.json({
    message: 'CBTC API - Cobel Business Training Center',
    status: 'active',
    entrepreneur: 'Abel Coulibaly',
    vision: 'L\'excellence entrepreneuriale à portée de tous'
  });
});

// Gestion des erreurs
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée dans la symphonie CBTC',
    requested_path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ 
    error: 'Erreur interne du serveur CBTC'
  });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CBTC Backend écoute sur le port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✨ La symphonie entrepreneuriale d'Abel commence !`);
});
