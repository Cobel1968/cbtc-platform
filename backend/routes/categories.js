import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateCategory } from '../middleware/validation.js';

const router = express.Router();

// Documentation de l'API CBTC - Votre guide d'utilisation
router.get('/', (req, res, next) => {
  if (req.query.docs === 'true') {
    return res.json({
      success: true,
      message: 'Documentation de l\'API CBTC Categories - Abel Coulibaly',
      project: 'CBTC Platform Backend',
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
        search: 'search (recherche dans nom et description)',
        demo: 'demo=true (mode démonstration sans authentification)'
      },
      examples: {
        list: '/api/categories?page=1&limit=10',
        search: '/api/categories?search=livre&page=1',
        demo: '/api/categories?demo=true',
        create: 'POST /api/categories {"name": "Romans", "description": "Collection de romans"}',
        update: 'PUT /api/categories/1 {"name": "Nouveaux Romans"}'
      },
      author: 'Abel Coulibaly - Entrepreneur & Expert en Gestion CBTC',
      version: '1.0.0'
    });
  }
  next();
});

// Routes publiques - Accessibles à tous vos visiteurs CBTC
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Middleware d'authentification pour les routes protégées
router.use(authenticateToken);

// Routes administrateur - Le sanctuaire de la gestion CBTC
router.post('/', requireAdmin, validateCategory, createCategory);
router.put('/:id', requireAdmin, validateCategory, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;