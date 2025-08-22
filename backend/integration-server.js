// CBTC Production Server - Railway Ready
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS for frontend integration
app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

console.log('🚀 Starting CBTC Integration Test Server...');

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    service: 'cbtc-backend-integration',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime())
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CBTC Integration Test API',
    status: 'active',
    endpoints: {
      health: 'GET /api/health',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me', 
      logout: 'POST /api/auth/logout'
    },
    testCredentials: {
      email: 'test@cbtc.com',
      password: 'testpass123'
    }
  });
});

// Authentication endpoints for testing
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login attempt:', req.body);
  
  const { email, password } = req.body;
  
  if (email === 'test@cbtc.com' && password === 'testpass123') {
    const token = 'demo-token-' + Date.now();
    const user = { 
      id: 1, 
      email, 
      name: 'Test User CBTC', 
      role: 'USER' 
    };
    
    console.log('✅ Login successful for:', email);
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      user,
      token
    });
  } else {
    console.log('❌ Login failed for:', email);
    res.status(401).json({ 
      success: false,
      error: 'Email ou mot de passe incorrect' 
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  console.log('👤 Me endpoint called');
  
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  console.log('🔑 Token received:', token ? 'Present' : 'Missing');
  
  if (!token || !token.startsWith('demo-token-')) {
    console.log('❌ Invalid or missing token');
    return res.status(401).json({ 
      success: false,
      error: 'Token requis' 
    });
  }
  
  console.log('✅ Token valid, returning user data');
  
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
  console.log('🚪 Logout endpoint called');
  
  res.json({ 
    success: true,
    message: 'Déconnexion réussie' 
  });
});

// Payment endpoints for testing
app.post('/api/payments/wave/initiate', (req, res) => {
  console.log('💰 Wave Payment Initiated:', req.body);
  
  const { programId, customerPhone, amount } = req.body;
  
  if (!customerPhone || !amount || amount < 1000) {
    return res.status(400).json({
      success: false,
      error: 'Données invalides - Téléphone et montant (min 1000 XOF) requis'
    });
  }
  
  const transactionId = `WAVE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const reference = `CBTC_${programId}`;
  
  res.json({
    success: true,
    message: 'Paiement Wave initié',
    transactionId,
    reference,
    instructions: `
🏦 PAIEMENT WAVE - CBTC PLATFORM

💰 Montant: ${amount.toLocaleString()} XOF
📱 Numéro CBTC: +2250555007884
🏢 Bénéficiaire: CBTC Platform - Abel Coulibaly
🔢 Référence: ${reference}

📋 ÉTAPES:
1. Ouvrez votre app Wave Money
2. Sélectionnez "Envoyer de l'argent"  
3. Entrez: +2250555007884
4. Montant: ${amount.toLocaleString()} XOF
5. Référence: ${reference}
6. Confirmez le paiement

📞 Support: +2250555007884
    `
  });
});

app.post('/api/payments/pos/cash', (req, res) => {
  console.log('💵 POS Cash Payment:', req.body);
  
  const { programId, amount, customerName, cashierName, terminalId, location } = req.body;
  
  if (!amount || amount < 1000 || !customerName || !cashierName) {
    return res.status(400).json({
      success: false,
      error: 'Données invalides - Montant, nom client et caissier requis'
    });
  }
  
  const receiptNumber = `CBTC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${terminalId}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
  const invoiceNumber = `INV-CBTC-${Date.now()}`;
  
  res.json({
    success: true,
    message: 'Paiement comptoir confirmé',
    receiptNumber,
    invoiceNumber,
    receiptUrl: `/receipts/${receiptNumber}.pdf`,
    terminal: {
      id: terminalId,
      location,
      cashier: cashierName
    }
  });
});

app.get('/api/payments/user/:userId', (req, res) => {
  console.log('📊 Payment History Request:', req.params.userId);
  
  // Mock payment history
  res.json({
    success: true,
    payments: [
      {
        id: '1',
        amount: 25000,
        currency: 'XOF',
        method: 'WAVE_MOBILE',
        status: 'COMPLETED',
        program: 'Excellence Entrepreneuriale',
        date: new Date().toISOString(),
        receiptNumber: 'WAVE_12345'
      },
      {
        id: '2', 
        amount: 15000,
        currency: 'XOF',
        method: 'CASH_POS',
        status: 'COMPLETED',
        program: 'Formation IELTS',
        date: new Date(Date.now() - 86400000).toISOString(),
        receiptNumber: 'CBTC-20240822-001-0001'
      }
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    requested_path: req.originalUrl,
    available_endpoints: {
      root: 'GET /',
      health: 'GET /api/health',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      logout: 'POST /api/auth/logout'
    }
  });
});

app.listen(PORT, () => {
  console.log('🚀 ===============================================');
  console.log('🧪 CBTC Integration Test Server READY!');
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log('🔐 Auth endpoints ready for testing');
  console.log('📝 Test credentials: test@cbtc.com / testpass123');
  console.log('🚀 ===============================================');
});
