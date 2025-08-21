/**
 * @class ApiResponse
 * @description Classe pour standardiser les réponses API
 */
export class ApiResponse {
constructor(statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 400;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();

    // Signature de l'auteur pour les réponses de succès
    if (this.success && data) {
    this.author = {
        name: 'Abel Coulibaly',
        role: 'Entrepreneur et Lecteur en gestion d\'entreprise',
        api: 'Categories Management System v1.0'
    };
    }
}

  // Méthodes statiques pour créer des réponses spécifiques
static success(data = null, message = "Opération réussie") {
    return new ApiResponse(200, data, message);
}

static created(data = null, message = "Ressource créée avec succès") {
    return new ApiResponse(201, data, message);
}

static validationError(errors = [], message = "Erreurs de validation détectées") {
    return new ApiResponse(400, {
    validationErrors: Array.isArray(errors) ? errors : [errors],
    errorCount: Array.isArray(errors) ? errors.length : 1
    }, message);
}

static notFound(resource = "Ressource", identifier = null) {
    return new ApiResponse(404, {
    resource,
    identifier,
    suggestions: [
        'Vérifier l\'ID ou les paramètres de recherche',
        'Consulter la liste des ressources disponibles'
    ]
    }, `${resource} ${identifier ? `avec l'identifiant "${identifier}"` : ''} introuvable`);
}

static conflict(message = "Conflit détecté", details = {}) {
    return new ApiResponse(409, {
    conflict: true,
    details,
    suggestions: [
        'Vérifier l\'unicité des données',
        'Modifier les valeurs en conflit'
    ]
    }, message);
}
}
