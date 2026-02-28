const jwt = require("jsonwebtoken");

function AuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization; //bareer token
    if (!authHeader) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const token = authHeader.split(" ")[1]; //remove bareer token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}
module.exports=AuthMiddleware;
