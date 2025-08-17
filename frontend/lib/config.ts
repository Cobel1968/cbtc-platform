export const API_URL = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')) || 
  '';

// Configuration pour les différents environnements
export const CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiUrl: API_URL,
  appName: 'CBTC',
  appDescription: "Plateforme d'excellence entrepreneuriale"
};
