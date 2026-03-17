import jwt from "jsonwebtoken";
import { getEnvVar } from "../getEnvVar.js";

export function verifyAuthToken(req, res, next) {
  // 1. Grab the "Authorization" header from the request
  const authHeader = req.get("Authorization");

  // 2. The header format is "Bearer <token>". We split it to get just the token.
  const token = authHeader && authHeader.split(" ")[1];

  // 3. If there's no token, stop here and return 401 Unauthorized
  if (!token) {
    return res.status(401).end();
  }

  // 4. Verify the token using your JWT_SECRET from the .env file
  jwt.verify(token, getEnvVar("JWT_SECRET"), (error, decodedToken) => {
    if (decodedToken) {
      // Success! Attach the user's info (like their username) to the request object
      req.userInfo = decodedToken;
      next(); // Move on to the actual route handler (like renaming or fetching)
    } else {
      // Token is expired or tampered with
      res.status(401).end();
    }
  });
}
