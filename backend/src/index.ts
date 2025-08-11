import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import programRoutes from './routes/programs.js';
import contentRoutes from './routes/content.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/content', contentRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    ...(config.nodeEnv === 'development' && { details: error.message })
  });
});

const port = config.port;

app.listen(port, () => {
  console.log(`🚀 Serveur CBTC démarré sur le port ${port}`);
  console.log(`🌍 Environnement: ${config.nodeEnv}`);
  console.log(`🔗 API disponible sur: http://localhost:${port}`);
});
