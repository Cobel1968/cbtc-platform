export class ApiResponse {
  constructor(statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 400;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.project = 'CBTC Platform';
    
    if (this.success && data) {
      this.author = {
        name: 'Abel Coulibaly',
        role: 'Entrepreneur et Lecteur en gestion d\'entreprise',
        api: 'CBTC Categories Management System v1.0'
      };
    }
  }

  static success(data = null, message = "Opération CBTC réussie") {
    return new ApiResponse(200, data, message);
  }

  static created(data = null, message = "Ressource CBTC créée avec succès") {
    return new ApiResponse(201, data, message);
  }

  static validationError(errors = [], message = "Erreurs de validation CBTC détectées") {
    return new ApiResponse(400, {
      validationErrors: Array.isArray(errors) ? errors : [errors],
      errorCount: Array.isArray(errors) ? errors.length : 1,
      project: 'CBTC Platform'
    }, message);
  }

  static notFound(resource = "Ressource CBTC", identifier = null) {
    return new ApiResponse(404, {
      resource,
      identifier,
      suggestions: [
        'Vérifier l\'ID ou les paramètres de recherche CBTC',
        'Consulter la liste des ressources CBTC disponibles'
      ],
      project: 'CBTC Platform'
    }, `${resource} ${identifier ? `avec l'identifiant "${identifier}"` : ''} introuvable`);
  }
}