/**
 * @function asyncHandler
 * @description Wrapper pour gérer les erreurs dans les fonctions asynchrones
 */
export const asyncHandler = (fn) => {
return (req, res, next) => {
    // Ajouter un timestamp pour mesurer les performances
    req.startTime = Date.now();

    Promise.resolve(fn(req, res, next))
    .catch((error) => {
        // Log détaillé de l'erreur
        console.error('=== ERREUR ASYNC HANDLER ===');
        console.error('Timestamp:', new Date().toISOString());
        console.error('Route:', req.method, req.originalUrl);
        console.error('User:', req.user?.name || 'Anonyme');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.error('============================');

        // Enrichir l'erreur avec le contexte
        error.context = {
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString(),
        user: req.user ? {
            id: req.user.id,
            name: req.user.name,
            role: req.user.role
        } : null
        };

        next(error);
    });
};
};
