"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../../../controllers/categoryController");
const auth_1 = require("../../../middleware/auth");
const validation_1 = require("../../../middleware/validation");
const router = (0, express_1.Router)();
// Documentation de l'API - Votre guide d'utilisation
router.get('/', async (req, res, next) => {
    if (req.query.docs === 'true') {
        return res.json({
            success: true,
            message: "Documentation de l'API Categories - Abel Coulibaly",
            endpoints: {
                public: {
                    'GET /': 'Liste toutes les catégories (avec pagination et recherche)',
                    'GET /:id': 'Récupère une catégorie par son ID'
                },
                protected: {
                    'POST /': 'Crée une nouvelle catégorie (Admin requis)',
                    'PUT /:id': 'Met à jour une catégorie (Admin requis)',
                    'DELETE /:id': 'Supprime une catégorie (Admin requis)'
                }
            },
            parameters: {
                pagination: 'page (défaut: 1), limit (défaut: 10, max: 100)',
                search: 'search (recherche dans nom et description)'
            },
            examples: {
                list: '/api/categories?page=1&limit=10',
                search: '/api/categories?search=livre&page=1',
                create: 'POST /api/categories {"name": "Romans", "description": "Collection de romans"}',
                update: 'PUT /api/categories/1 {"name": "Nouveaux Romans"}'
            },
            author: 'Abel Coulibaly - Entrepreneur & Expert en Gestion',
            version: '1.0.0'
        });
    }
    next();
});
// Routes publiques - Accessibles à tous vos visiteurs
router.get('/', categoryController_1.getAllCategories);
router.get('/:id', categoryController_1.getCategoryById);
// Middleware d'authentification pour les routes protégées
router.use(auth_1.authenticateToken);
// Routes administrateur - Le sanctuaire de la gestion
router.post('/', auth_1.requireAdmin, validation_1.validateCategory, categoryController_1.createCategory);
router.put('/:id', auth_1.requireAdmin, validation_1.validateCategory, categoryController_1.updateCategory);
router.delete('/:id', auth_1.requireAdmin, categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.js.map