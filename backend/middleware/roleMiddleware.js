const authorize = (...roles) => {
  return (req, res, next) => {
    // We check the req.user object that our 'protect' middleware created
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: User with role '${req.user.role}' cannot access this resource.` 
      });
    }
    next();
  };
};

module.exports = { authorize };