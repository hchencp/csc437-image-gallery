import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { SHARED_TEST } from "./shared/example.js";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";
import { connectMongo } from "./connectMongo.js";
import { ImageProvider } from "./ImageProvider.js";

// 1. Import the new router function
import { registerImageRoutes } from "./routes/imageRoutes.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";

const mongoClient = connectMongo();
const imageProvider = new ImageProvider(mongoClient);

const app = express();

// 2. Add JSON middleware (Required for Lab 22a POST/PATCH requests)
app.use(express.json());
app.use(express.static(STATIC_DIR));

// 3. Register the image-related routes
registerImageRoutes(app, imageProvider);

// Hello API remains here as it's a generic test
app.get("/api/hello", (req, res) => {
  res.send("Hello, World " + SHARED_TEST);
});

app.get(Object.values(VALID_ROUTES), (req, res) => {
  res.sendFile("index.html", { root: STATIC_DIR });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}. CTRL+C to stop.`);
});
