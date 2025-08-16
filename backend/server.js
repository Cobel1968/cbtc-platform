import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import process from 'node:process';
import Stripe from 'stripe';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Tes portes d'entrée sécurisées
const allowedOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: allowedOrigin === '*' ? true : allowedOrigin,
  credentials: false
}));

// Sécurité et performances - Tes gardiens silencieux
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Stripe webhook - L'oreille attentive aux transactions
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

  app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Stripe signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        break;
      case 'checkout.session.completed':
        console.log('Checkout completed:', event.data.object.id);
        break;
      default:
        console.log('Unhandled Stripe event:', event.type);
    }
    res.json({ received: true });
  });
}

// Parsers - Tes traducteurs universels
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Healthcheck - Le pouls de ton empire
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    service: 'cbtc-backend',
    env: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Racine - Ton message d'accueil
app.get('/', (req, res) => {
  res.send('CBTC API — L'orchestre s\'accorde, Maestro Abel.');
});

// Gestion des erreurs - Tes filets de sécurité
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée dans la symphonie' });
});

app.use((err, req, res, next) => {
  console.error('Erreur inattendue:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`CBTC backend écoute sur le port ${PORT} - La symphonie commence !`);
});
