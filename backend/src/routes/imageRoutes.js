import { ObjectId } from "mongodb";
import {
  imageMiddlewareFactory,
  handleImageFileErrors,
} from "./imageUploadMiddleware.js";

export function registerImageRoutes(app, imageProvider) {
  // 1. GET ALL IMAGES
  app.get("/api/images", async (req, res) => {
    try {
      const images = await imageProvider.getAllImages();
      res.json(images);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  });

  // 2. GET ONE IMAGE BY ID
  app.get("/api/images/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(404).send({
        error: "Not Found",
        message: "No image with that ID",
      });
    }

    const image = await imageProvider.getOneImage(id);

    if (!image) {
      return res.status(404).send({
        error: "Not Found",
        message: "No image with that ID",
      });
    }
    res.json(image);
  });

  // 3. RENAME IMAGE (PATCH)
  app.patch("/api/images/:id", async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;
    const loggedInUsername = req.userInfo?.username;

    if (!ObjectId.isValid(id)) {
      return res.status(404).send({
        error: "Not Found",
        message: "Image does not exist",
      });
    }

    if (!newName || typeof newName !== "string") {
      return res.status(400).send({
        error: "Bad Request",
        message: "Your request body must include a 'newName' string.",
      });
    }

    if (newName.length > 100) {
      return res.status(413).send({
        error: "Content Too Large",
        message: `Image name exceeds 100 characters`,
      });
    }

    // Ownership Check
    const image = await imageProvider.getOneImage(id);
    if (!image) {
      return res
        .status(404)
        .send({ error: "Not Found", message: "Image does not exist" });
    }

    if (image.author.username !== loggedInUsername) {
      return res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this image",
      });
    }

    const matchedCount = await imageProvider.updateImageName(id, newName);
    if (matchedCount === 0) {
      return res
        .status(404)
        .send({ error: "Not Found", message: "Image does not exist" });
    }

    res.status(204).send();
  });

  // 4. UPLOAD IMAGE (POST) - Lab 24
  app.post(
    "/api/images",
    imageMiddlewareFactory.single("image"), // Looks for <input name="image">
    handleImageFileErrors,
    async (req, res) => {
      try {
        const { name } = req.body; // The "title" from the form
        const file = req.file; // The file from Multer
        const loggedInUsername = req.userInfo?.username;

        // Validation
        if (!file || !name) {
          return res.status(400).send({
            error: "Bad Request",
            message: "Missing image file or image title.",
          });
        }

        // Save metadata to DB via Provider
        const newId = await imageProvider.createImage(
          name,
          file.filename,
          loggedInUsername,
        );

        // Success: 201 Created
        res.status(201).send({ id: newId });
      } catch (error) {
        console.error("Upload error:", error);
        res
          .status(500)
          .send({ error: "Internal Server Error", message: error.message });
      }
    },
  );
}
