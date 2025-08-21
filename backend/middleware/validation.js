import { ApiResponse } from '../utils/ApiResponse.js';

export const validateCategory = (req, res, next) => {
  const { name, description } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Le nom de la catégorie CBTC est requis');
  } else {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    } else if (trimmedName.length > 100) {
      errors.push('Le nom ne peut pas dépasser 100 caractères');
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push('La description doit être une chaîne de caractères');
    } else if (description.length > 500) {
      errors.push('La description ne peut pas dépasser 500 caractères');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json(
      new ApiResponse(400, {
        validationErrors: errors,
        receivedData: {
          name: name ? `"${name}" (${typeof name})` : 'non fourni',
          description: description !== undefined ? `"${description?.substring(0, 50)}..." (${typeof description})` : 'non fourni'
        },
        requirements: {
          name: 'Obligatoire: chaîne de 2-100 caractères',
          description: 'Optionnel: chaîne de maximum 500 caractères'
        },
        project: 'CBTC Platform'
      }, 
      'Erreurs de validation CBTC détectées')
    );
  }

  if (name) req.body.name = name.trim();
  if (description !== undefined) req.body.description = description.trim();

  next();
};