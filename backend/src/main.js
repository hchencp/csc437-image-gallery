import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { SHARED_TEST } from "./shared/example.js";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";
import { connectMongo } from "./connectMongo.js";
import { ImageProvider } from "./ImageProvider.js";
import CredentialsProvider from "./CredentialsProvider.js"; // 1. Added Import

import { registerImageRoutes } from "./routes/imageRoutes.js";
import { registerAuthRoutes } from "./routes/authRoutes.js";
import { verifyAuthToken } from "./routes/authMiddleware.js"; // 2. Added Import

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";

const mongoClient = connectMongo();
const imageProvider = new ImageProvider(mongoClient);
const credentialsProvider = new CredentialsProvider(mongoClient); // 3. Initialize Provider

const app = express();

app.use(express.json());
app.use(express.static(STATIC_DIR));
app.use("/uploads", express.static(getEnvVar("IMAGE_UPLOAD_DIR") || "uploads"));

// 4. Register Auth Routes FIRST (These must be public so people can login)
registerAuthRoutes(app, credentialsProvider);

// 5. PROTECT THE DATA APIs
// This middleware runs for every request starting with /api/images
app.use("/api/images", verifyAuthToken);

// 6. Register Image Routes SECOND (These are now protected by the line above)
registerImageRoutes(app, imageProvider);

app.get("/api/hello", (req, res) => {
  res.send("Hello, World " + SHARED_TEST);
});

app.get(Object.values(VALID_ROUTES), (req, res) => {
  res.sendFile("index.html", { root: STATIC_DIR });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}. CTRL+C to stop.`);
});
