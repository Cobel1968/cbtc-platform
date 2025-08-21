import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Base de données en mémoire pour votre plateforme CBTC
const categories = new Map();
let nextId = 1;

// Données de démonstration CBTC pour Abel
const initializeCBTCData = () => {
  if (categories.size === 0) {
    const cbctDemoCategories = [
      {
        id: nextId++,
        name: 'Gestion CBTC',
        description: 'Catégories liées à la gestion de la plateforme CBTC',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString(),
        createdBy: 1,
        isActive: true,
        project: 'CBTC Platform'
      },
      {
        id: nextId++,
        name: 'Entrepreneuriat Digital',
        description: 'Ressources pour entrepreneurs du numérique CBTC',
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-02-10').toISOString(),
        createdBy: 1,
        isActive: true,
        project: 'CBTC Platform'
      },
      {
        id: nextId++,
        name: 'Formation CBTC',
        description: 'Modules de formation de la plateforme CBTC',
        createdAt: new Date('2024-02-15').toISOString(),
        updatedAt: new Date('2024-02-15').toISOString(),
        createdBy: 1,
        isActive: true,
        project: 'CBTC Platform'
      }
    ];

    cbctDemoCategories.forEach(category => {
      categories.set(category.id, category);
    });
  }
};

// Initialiser les données CBTC
initializeCBTCData();

export const getAllCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

  let allCategories = Array.from(categories.values());

  if (search) {
    const searchLower = search.toLowerCase();
    allCategories = allCategories.filter(cat => 
      cat.name.toLowerCase().includes(searchLower) ||
      (cat.description && cat.description.toLowerCase().includes(searchLower))
    );
  }

  allCategories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
    filters: { search },
    project: 'CBTC Platform'
  }, `${totalItems} catégorie(s) CBTC trouvée(s)`));
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);
  
  if (isNaN(categoryId)) {
    return res.status(400).json(
      new ApiResponse(400, null, 'ID de catégorie CBTC invalide')
    );
  }

  const category = categories.get(categoryId);
  
  if (!category) {
    return res.status(404).json(
      new ApiResponse(404, null, `Catégorie CBTC avec l'ID ${categoryId} introuvable`)
    );
  }

  const enrichedCategory = {
    ...category,
    metadata: {
      ageInDays: Math.floor((new Date() - new Date(category.createdAt)) / (1000 * 60 * 60 * 24)),
      lastModifiedDays: Math.floor((new Date() - new Date(category.updatedAt)) / (1000 * 60 * 60 * 24)),
      project: 'CBTC Platform'
    }
  };
  
  res.json(new ApiResponse(200, enrichedCategory, 'Catégorie CBTC récupérée avec succès'));
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive = true } = req.body;
  
  const existingCategory = Array.from(categories.values())
    .find(cat => cat.name.toLowerCase() === name.trim().toLowerCase());
  
  if (existingCategory) {
    return res.status(409).json(
      new ApiResponse(409, null, `Une catégorie CBTC avec le nom "${name}" existe déjà`)
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
    createdBy: req.user?.id || 1,
    project: 'CBTC Platform'
  };
  
  categories.set(category.id, category);
  
  res.status(201).json(
    new ApiResponse(201, category, `Catégorie CBTC "${category.name}" créée avec succès`)
  );
});

export const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);
  
  if (isNaN(categoryId)) {
    return res.status(400).json(
      new ApiResponse(400, null, 'ID de catégorie CBTC invalide')
    );
  }

  const existing = categories.get(categoryId);
  
  if (!existing) {
    return res.status(404).json(
      new ApiResponse(404, null, `Catégorie CBTC avec l'ID ${categoryId} introuvable`)
    );
  }

  const { name, description, isActive } = req.body;
  
  if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
    const duplicateCategory = Array.from(categories.values())
      .find(cat => cat.id !== categoryId && cat.name.toLowerCase() === name.trim().toLowerCase());
    
    if (duplicateCategory) {
      return res.status(409).json(
        new ApiResponse(409, null, `Une autre catégorie CBTC avec le nom "${name}" existe déjà`)
      );
    }
  }

  const updated = {
    ...existing,
    name: name ? name.trim() : existing.name,
    description: description !== undefined ? description.trim() : existing.description,
    isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
    updatedAt: new Date().toISOString(),
    updatedBy: req.user?.id || 1,
    project: 'CBTC Platform'
  };
  
  categories.set(categoryId, updated);
  
  res.json(new ApiResponse(200, updated, `Catégorie CBTC "${updated.name}" mise à jour avec succès`));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);
  
  if (isNaN(categoryId)) {
    return res.status(400).json(
      new ApiResponse(400, null, 'ID de catégorie CBTC invalide')
    );
  }

  const category = categories.get(categoryId);
  
  if (!category) {
    return res.status(404).json(
      new ApiResponse(404, null, `Catégorie CBTC avec l'ID ${categoryId} introuvable`)
    );
  }

  const deleted = categories.delete(categoryId);
  
  if (!deleted) {
    return res.status(500).json(
      new ApiResponse(500, null, 'Erreur lors de la suppression de la catégorie CBTC')
    );
  }

  res.json(new ApiResponse(200, {
    deletedCategory: {
      id: category.id,
      name: category.name,
      project: 'CBTC Platform'
    },
    deletedAt: new Date().toISOString(),
    deletedBy: req.user?.id || 1
  }, `Catégorie CBTC "${category.name}" supprimée avec succès`));
});