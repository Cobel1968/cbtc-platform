import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse';

// Clé secrète pour les JWT
const JWT_SECRET = process.env.JWT_SECRET || 'abel-coulibaly-secret-key-2024';

// Utilisateurs de démonstration
const demoUsers = new Map([
  [1, {
    id: 1,
    email: 'abel@example.com',
    name: 'Abel Coulibaly',
    role: 'admin',
    isActive: true,
    profile: {
      occupation: 'Entrepreneur et Lecteur en gestion d\'entreprise',
      birthDate: '1968-06-10',
      expertise: ['gestion', 'entrepreneuriat', 'leadership']
    }
  }],
  [2, {
    id: 2,
    email: 'user@example.com',
    name: 'Utilisateur Test',
    role: 'user',
    isActive: true
  }]
]);

/**
 * @desc Générer un token JWT de démonstration
 */
export const generateDemoToken = (userId: number) => {
  const user = demoUsers.get(userId);
  if (!user) return null;

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * @desc Middleware d'authentification
 */
export const authenticateToken = (req: { headers: { [x: string]: any; }; query: { demo: string; }; user: { id: number; email: string; name: string; role: string; isActive: boolean; profile: { occupation: string; birthDate: string; expertise: string[]; }; } | { id: number; email: string; name: string; role: string; isActive: boolean; profile?: undefined; } | undefined; tokenPayload: string | jwt.JwtPayload; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): any; new(): any; }; }; }, next: () => void) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  // Mode démonstration pour les tests
  if (!token && req.query.demo === 'true') {
    req.user = demoUsers.get(1); // Utilisateur admin par défaut
    return next();
  }

  if (!token) {
    return res.status(401).json(
      new ApiResponse(401, null, 'Token d\'authentification requis. Utilisez Authorization: Bearer <token>')
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = demoUsers.get(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json(
        new ApiResponse(401, null, 'Utilisateur introuvable ou désactivé')
      );
    }

    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (error) {
    let message = 'Token invalide';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expiré';
    }

    return res.status(401).json(
      new ApiResponse(401, null, message)
    );
  }
};

/**
 * @desc Middleware pour vérifier les droits administrateur
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(
      new ApiResponse(401, null, 'Authentification requise')
    );
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json(
      new ApiResponse(403, null, 'Droits administrateur requis pour cette action')
    );
  }

  next();
};

/**
 * @desc Créer des tokens de démonstration
 */
export const createDemoTokens = () => {
  const adminToken = generateDemoToken(1);
  const userToken = generateDemoToken(2);

  return {
    admin: {
      user: demoUsers.get(1),
      token: adminToken,
      header: `Bearer ${adminToken}`
    },
    user: {
      user: demoUsers.get(2),
      token: userToken,
      header: `Bearer ${userToken}`
    },
    usage: {
      curl_admin: `curl -H "Authorization: Bearer ${adminToken}" http://localhost:3000/api/categories`,
      demo_mode: 'http://localhost:3000/api/categories?demo=true'
    }
  };
};
