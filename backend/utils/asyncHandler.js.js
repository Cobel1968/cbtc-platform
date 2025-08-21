export const asyncHandler = (fn) => {
  return (req, res, next) => {
    req.startTime = Date.now();
    
    Promise.resolve(fn(req, res, next))
      .catch((error) => {
        console.error('=== ERREUR ASYNC HANDLER CBTC ===');
        console.error('Timestamp:', new Date().toISOString());
        console.error('Route:', req.method, req.originalUrl);
        console.error('User:', req.user?.name || 'Anonyme');
        console.error('Error:', error.message);
        console.error('Project: CBTC Platform');
        console.error('================================');

        error.context = {
          method: req.method,
          url: req.originalUrl,
          timestamp: new Date().toISOString(),
          project: 'CBTC Platform',
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