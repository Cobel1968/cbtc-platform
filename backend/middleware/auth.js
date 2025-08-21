import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'abel-coulibaly-cbtc-secret-key-2024';

const cbtcUsers = new Map([
  [1, {
    id: 1,
    email: 'abel@cbtc.com',
    name: 'Abel Coulibaly',
    role: 'admin',
    isActive: true,
    profile: {
      occupation: 'Entrepreneur et Lecteur en gestion d\'entreprise',
      birthDate: '1968-06-10',
      expertise: ['gestion', 'entrepreneuriat', 'leadership'],
      project: 'CBTC Platform'
    }
  }],
  [2, {
    id: 2,
    email: 'user@cbtc.com',
    name: 'Utilisateur CBTC',
    role: 'user',
    isActive: true,
    project: 'CBTC Platform'
  }]
]);

export const generateDemoToken = (userId) => {
  const user = cbtcUsers.get(userId);
  if (!user) return null;

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      project: 'CBTC Platform'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token && req.query.demo === 'true') {
    req.user = cbtcUsers.get(1);
    return next();
  }

  if (!token) {
    return res.status(401).json(
      new ApiResponse(401, null, 'Token d\'authentification CBTC requis. Utilisez Authorization: Bearer <token>')
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = cbtcUsers.get(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json(
        new ApiResponse(401, null, 'Utilisateur CBTC introuvable ou désactivé')
      );
    }

    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (error) {
    let message = 'Token CBTC invalide';
    if (error.name === 'TokenExpiredError') {
      message = 'Token CBTC expiré';
    }

    return res.status(401).json(
      new ApiResponse(401, null, message)
    );
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(
      new ApiResponse(401, null, 'Authentification CBTC requise')
    );
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json(
      new ApiResponse(403, null, 'Droits administrateur CBTC requis pour cette action')
    );
  }

  next();
};