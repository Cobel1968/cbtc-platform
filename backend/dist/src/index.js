"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const categories_js_1 = __importDefault(require("./routes/categories.js"));
// Configuration de l'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware essentiels pour le parsing des données
app.use(express_1.default.json({
    limit: '10mb',
    strict: true
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '10mb'
}));
// Route de santé - Pour vérifier que votre API respire
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Abel Categories - Système opérationnel',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        author: 'Abel Coulibaly - Entrepreneur & Lecteur en gestion d\'entreprise'
    });
});
// Route d'accueil - Votre vitrine digitale
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenue dans l\'API de gestion des catégories d\'Abel Coulibaly',
        endpoints: {
            health: 'GET /health',
            categories: 'GET /api/categories',
            documentation: 'GET /api/categories?docs=true'
        },
        version: '1.0.0',
        author: {
            name: 'Abel Coulibaly',
            profession: 'Entrepreneur et Lecteur en gestion d\'entreprise',
            birthDate: '1968-06-10'
        }
    });
});
// Montage de vos routes principales - L'assemblage final
app.use('/api/categories', categories_js_1.default);
// Gestionnaire pour les routes non trouvées - 404 élégant
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route non trouvée: ${req.method} ${req.originalUrl}`,
        availableRoutes: {
            home: 'GET /',
            health: 'GET /health',
            categories: 'GET /api/categories'
        },
        timestamp: new Date().toISOString()
    });
});
// Middleware de gestion des erreurs - Le filet de sécurité ultime
app.use((err, req, res, next) => {
    console.error('=== ERREUR SYSTÈME ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('URL:', req.originalUrl);
    console.error('Method:', req.method);
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('======================');
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur interne du serveur',
        error: isDevelopment ? {
            stack: err.stack,
            details: err.toString()
        } : undefined,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
});
// Démarrage du serveur - L'envol de votre création
const server = app.listen(PORT, () => {
    console.log('🚀 ===============================================');
    console.log('🎯 API Abel Categories - Démarrage réussi !');
    console.log('🚀 ===============================================');
    console.log(`📡 Serveur en écoute sur le port ${PORT}`);
    console.log(`🌐 URL locale: http://localhost:${PORT}`);
    console.log(`🏥 Santé API: http://localhost:${PORT}/health`);
    console.log(`📚 Catégories: http://localhost:${PORT}/api/categories`);
    console.log(`⏰ Démarré le: ${new Date().toLocaleString('fr-FR')}`);
    console.log('🚀 ===============================================');
});
exports.default = app;
//# sourceMappingURL=index.js.map