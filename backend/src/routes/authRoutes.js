import jwt from "jsonwebtoken";
import { getEnvVar } from "../getEnvVar.js";

/**
 * Creates a Promise for a JWT token, with a specified username embedded inside.
 *
 * @param username the username to embed in the JWT token
 * @return a Promise for a JWT
 */
function generateAuthToken(username) {
  return new Promise((resolve, reject) => {
    const payload = { username };
    jwt.sign(
      payload,
      getEnvVar("JWT_SECRET"),
      { expiresIn: "1d" }, // Token expires in 1 day
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      },
    );
  });
}

export function registerAuthRoutes(app, credentialsProvider) {
  // Account creation API
  app.post("/api/users", async (req, res) => {
    const { username, email, password } = req.body;

    // Check if the request is missing any information
    if (!username || !email || !password) {
      return res.status(400).send({
        error: "Bad request",
        message: "Missing username, email, or password",
      });
    }

    try {
      // Attempt to save the user to the database using the provider instance
      const success = await credentialsProvider.registerUser(
        username,
        email,
        password,
      );

      if (!success) {
        return res.status(409).send({
          error: "Conflict",
          message: "Username already taken",
        });
      }

      // Generate a token so the user is logged in immediately after registering
      const token = await generateAuthToken(username);
      res.status(201).send({ token: token });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).send({ error: "Internal server error" });
    }
  });

  // Login API
  app.post("/api/auth/tokens", async (req, res) => {
    const { username, password } = req.body;

    // Check if the request is missing info
    if (!username || !password) {
      return res.status(400).send({
        error: "Bad request",
        message: "Missing username or password",
      });
    }

    try {
      // Verify the password matches the hash in the database
      const isValid = await credentialsProvider.verifyPassword(
        username,
        password,
      );

      if (!isValid) {
        return res.status(401).send({
          error: "Unauthorized",
          message: "Invalid username or password",
        });
      }

      // If valid, generate the JWT and send it back to the client
      const token = await generateAuthToken(username);
      res.status(200).send({ token: token });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).send({ error: "Internal server error" });
    }
  });
}
