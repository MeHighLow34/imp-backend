import { UnAuthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError(
      "Authentication Invalid because " + authHeader
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //payload is what we set up in createJWT function when creating/logging user
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalidinho");
  }
}

export default auth;
