// Minimal CBTC Backend for Integration Testing
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// CORS for frontend integration
app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    service: 'cbtc-backend',
    timestamp: new Date().toISOString()
  });
});

// Test authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@cbtc.com' && password === 'testpass123') {
    const token = 'demo-token-' + Date.now();
    res.json({
      success: true,
      message: 'Connexion réussie',
      user: { 
        id: 1, 
        email, 
        name: 'Test User CBTC', 
        role: 'USER' 
      },
      token
    });
  } else {
    res.status(401).json({ 
      success: false,
      error: 'Email ou mot de passe incorrect' 
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token || !token.startsWith('demo-token-')) {
    return res.status(401).json({ 
      success: false,
      error: 'Token requis' 
    });
  }
  
  res.json({
    success: true,
    user: { 
      id: 1, 
      email: 'test@cbtc.com', 
      name: 'Test User CBTC', 
      role: 'USER' 
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ 
    success: true,
    message: 'Déconnexion réussie' 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CBTC API - Integration Test Server',
    status: 'active',
    endpoints: {
      health: 'GET /api/health',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      logout: 'POST /api/auth/logout'
    }
  });
});

app.listen(PORT, () => {
  console.log('🚀 ===============================================');
  console.log('🧪 CBTC Integration Test Server Started!');
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log('🔐 Auth endpoints ready for testing');
  console.log('🚀 ===============================================');
});
