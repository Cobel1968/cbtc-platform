// routes/categories.js
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

/**
 * Routes publiques - Accessibles à tous vos visiteurs
 * Comme les vitrines d'un magasin, ouvertes à la contemplation
 */
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

/**
 * Routes protégées - Réservées aux utilisateurs authentifiés
 * Tel un jardin secret où seuls les invités peuvent pénétrer
 */
router.use(authenticateToken);

/**
 * Routes administrateur - Le sanctuaire de la gestion
 * Où seuls les gardiens peuvent créer, modifier et supprimer
 */
router.post('/', requireAdmin, validateCategory, createCategory);
router.put('/:id', requireAdmin, validateCategory, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;
