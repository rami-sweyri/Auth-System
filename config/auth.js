module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.status(401).json({msg: 'You are not loged in'});
    },

    EditorAuthorized: function(req, res, next) {
        if (req.isAuthenticated() && req.user.isEditor()) {
          return next();
        }
        res.status(401).json({msg: 'You are not Editor'});
      },

    OwnerAuthorized: function(req, res, next) {
        if (req.isAuthenticated() && req.user.isOwner()) {
          return next();
        }
        res.status(401).json({msg: 'You are not Owner'});
      },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.send('dashboard');      
    }
  };