const Jwt = require("jsonwebtoken");

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    Jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) {
        res.status(404).json("Token Not Valid ");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json("Not Authenticate");
  }
};

const VerifyandAuth = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Not allowed");
    }
  });
};


const VerifyandAdmin = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Not allowed");
    }
  });
};

module.exports = { VerifyToken, VerifyandAuth, VerifyandAdmin };
