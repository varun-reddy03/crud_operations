const jwt = require("jsonwebtoken");

// Secret key for JWT (should be the same as used in userService)
const JWT_SECRET = "varun_reddy";

const authenticate = async (request, reply) => {
  const authHeader = request.headers["authorization"];

  console.log("=======================", authHeader);

  // Check if Authorization header is provided
  if (!authHeader) {
    reply.status(401).send({ error: "No token provided" });
    return;
  }

  try {
    
    const user = jwt.verify(authHeader, JWT_SECRET);
    request.user = user;
    console.log(request);
  } catch (err) {
    console.error(err);
    reply.status(403).send({ error: "Invalid token" });
  }
};

module.exports = authenticate;
