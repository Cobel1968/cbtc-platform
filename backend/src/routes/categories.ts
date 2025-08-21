import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../../controllers/categoryController';
import { authenticateToken, requireAdmin } from '../../../middleware/auth';
import { validateCategory } from '../../../middleware/validation';

const router = Router();


// Documentation de l'API - Votre guide d'utilisation
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Middleware d'authentification pour les routes protégées
router.use(authenticateToken);

// Routes administrateur - Le sanctuaire de la gestion
router.post('/', requireAdmin, validateCategory, createCategory);
router.put('/:id', requireAdmin, validateCategory, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);


export default router;
