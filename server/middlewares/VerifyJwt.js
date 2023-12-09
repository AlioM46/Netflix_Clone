const jwt = require("jsonwebtoken");

const verifyJwt = async (req, res, next) => {
  const token = req.headers.authorization || req.headers.Authorization;

  if (!token || !token?.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({message: "Unauthorized. Token should start with 'Bearer'"});
  }

  const accessToken = token.split(" ")[1];

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({message: "Forbidden"});
    req.decoded = decoded;

    next();
  });
};

module.exports = verifyJwt;
