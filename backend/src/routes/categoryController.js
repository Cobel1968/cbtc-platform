import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Simulation d'une base de données en mémoire pour commencer
const categories = new Map();
let nextId = 1;

// Données de démonstration pour Abel
const initializeData = () => {
if (categories.size === 0) {
    const demoCategories = [
    {
        id: nextId++,
        name: 'Livres de Gestion',
        description: 'Ouvrages spécialisés en gestion d\'entreprise et leadership',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString(),
        createdBy: 1,
        isActive: true
    },
    {
        id: nextId++,
        name: 'Entrepreneuriat',
        description: 'Ressources pour entrepreneurs et créateurs d\'entreprise',
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-02-10').toISOString(),
        createdBy: 1,
        isActive: true
    },
    {
        id: nextId++,
        name: 'Développement Personnel',
        description: 'Guides pour le développement des compétences personnelles',
        createdAt: new Date('2024-02-15').toISOString(),
        updatedAt: new Date('2024-02-15').toISOString(),
        createdBy: 1,
        isActive: true
    }
    ];

    demoCategories.forEach(category => {
    categories.set(category.id, category);
    });
}
};

// Initialiser les données de démonstration
initializeData();

/**
 * @desc Récupérer toutes les catégories
 * @route GET /api/categories
 * @access Public
 */
export const getAllCategories = asyncHandler(async (req, res) => {
const { page = 1, limit = 10, search = '' } = req.query;

  // Validation des paramètres
const pageNum = Math.max(1, parseInt(page));
const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

let allCategories = Array.from(categories.values());

  // Recherche textuelle si spécifiée
if (search) {
    const searchLower = search.toLowerCase();
    allCategories = allCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchLower) ||
    (cat.description && cat.description.toLowerCase().includes(searchLower))
    );
}

  // Tri par date de création (plus récent en premier)
allCategories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Pagination
const totalItems = allCategories.length;
const totalPages = Math.ceil(totalItems / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
const paginatedCategories = allCategories.slice(startIndex, startIndex + limitNum);

res.json(new ApiResponse(200, {
    categories: paginatedCategories,
    pagination: {
    page: pageNum,
    limit: limitNum,
    total: totalItems,
    pages: totalPages,
    hasNext: pageNum < totalPages,
    hasPrev: pageNum > 1
    },
    filters: { search }
}, `${totalItems} catégorie(s) trouvée(s)`));
});

/**
 * @desc Récupérer une catégorie par ID
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = asyncHandler(async (req, res) => {
const categoryId = parseInt(req.params.id);

if (isNaN(categoryId)) {
    return res.status(400).json(
    new ApiResponse(400, null, 'ID de catégorie invalide')
    );
}

const category = categories.get(categoryId);

if (!category) {
    return res.status(404).json(
    new ApiResponse(404, null, `Catégorie avec l'ID ${categoryId} introuvable`)
    );
}

  // Enrichir avec des métadonnées
const enrichedCategory = {
    ...category,
    metadata: {
      ageInDays: Math.floor((new Date() - new Date(category.createdAt)) / (1000 * 60 * 60 * 24)),
      lastModifiedDays: Math.floor((new Date() - new Date(category.updatedAt)) / (1000 * 60 * 60 * 24))
    }
};

res.json(new ApiResponse(200, enrichedCategory, 'Catégorie récupérée avec succès'));
});

/**
 * @desc Créer une nouvelle catégorie
 * @route POST /api/categories
 * @access Private (Admin)
 */
export const createCategory = asyncHandler(async (req, res) => {
const { name, description, isActive = true } = req.body;

  // Vérification de l'unicité du nom
const existingCategory = Array.from(categories.values())
    .find(cat => cat.name.toLowerCase() === name.trim().toLowerCase());

if (existingCategory) {
    return res.status(409).json(
    new ApiResponse(409, null, `Une catégorie avec le nom "${name}" existe déjà`)
    );
}

const now = new Date().toISOString();
const category = {
    id: nextId++,
    name: name.trim(),
    description: description ? description.trim() : '',
    isActive: Boolean(isActive),
    createdAt: now,
    updatedAt: now,
    createdBy: req.user?.id || 1
};

categories.set(category.id, category);

res.status(201).json(
    new ApiResponse(201, category, `Catégorie "${category.name}" créée avec succès`)
);
});

/**
 * @desc Mettre à jour une catégorie
 * @route PUT /api/categories/:id
 * @access Private (Admin)
 */
export const updateCategory = asyncHandler(async (req, res) => {
const categoryId = parseInt(req.params.id);

if (isNaN(categoryId)) {
    return res.status(400).json(
    new ApiResponse(400, null, 'ID de catégorie invalide')
    );
}

const existing = categories.get(categoryId);

if (!existing) {
    return res.status(404).json(
    new ApiResponse(404, null, `Catégorie avec l'ID ${categoryId} introuvable`)
    );
}

const { name, description, isActive } = req.body;

  // Vérification de l'unicité du nom si modifié
if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
    const duplicateCategory = Array.from(categories.values())
    .find(cat => cat.id !== categoryId && cat.name.toLowerCase() === name.trim().toLowerCase());

    if (duplicateCategory) {
    return res.status(409).json(
        new ApiResponse(409, null, `Une autre catégorie avec le nom "${name}" existe déjà`)
    );
    }
}

const updated = {
    ...existing,
    name: name ? name.trim() : existing.name,
    description: description !== undefined ? description.trim() : existing.description,
    isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
    updatedAt: new Date().toISOString(),
    updatedBy: req.user?.id || 1
};

categories.set(categoryId, updated);

res.json(new ApiResponse(200, updated, `Catégorie "${updated.name}" mise à jour avec succès`));
});

/**
 * @desc Supprimer une catégorie
 * @route DELETE /api/categories/:id
 * @access Private (Admin)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
const categoryId = parseInt(req.params.id);

if (isNaN(categoryId)) {
    return res.status(400).json(
    new ApiResponse(400, null, 'ID de catégorie invalide')
    );
}

const category = categories.get(categoryId);

if (!category) {
    return res.status(404).json(
    new ApiResponse(404, null, `Catégorie avec l'ID ${categoryId} introuvable`)
    );
}

const deleted = categories.delete(categoryId);

if (!deleted) {
    return res.status(500).json(
    new ApiResponse(500, null, 'Erreur lors de la suppression de la catégorie')
    );
}

res.json(new ApiResponse(200, {
    deletedCategory: {
    id: category.id,
    name: category.name
    },
    deletedAt: new Date().toISOString(),
    deletedBy: req.user?.id || 1
}, `Catégorie "${category.name}" supprimée avec succès`));
});
