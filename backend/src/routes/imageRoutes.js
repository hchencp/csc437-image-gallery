import express from "express";
import { ObjectId } from "mongodb"; // Make sure to import this

export function registerImageRoutes(app, imageProvider) {
  app.get("/api/images", async (req, res) => {
    try {
      const images = await imageProvider.getAllImages();
      res.json(images);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  });

  // API 1: Get one image by ID
  app.get("/api/images/:id", async (req, res) => {
    const { id } = req.params;

    // 1. Check if ID is a valid format BEFORE calling the DB
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

  // API 2: Rename Image
  app.patch("/api/images/:id", async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    // 1. Invalid ID format check
    if (!ObjectId.isValid(id)) {
      return res.status(404).send({
        error: "Not Found",
        message: "Image does not exist",
      });
    }

    // 2. Bad Request validation
    if (!newName || typeof newName !== "string") {
      return res.status(400).send({
        error: "Bad Request",
        message: "Your request body must include a 'newName' string.",
      });
    }

    // 3. Content Too Large validation
    if (newName.length > 100) {
      const MAX_NAME_LENGTH = 100;
      return res.status(413).send({
        error: "Content Too Large",
        message: `Image name exceeds ${MAX_NAME_LENGTH} characters`,
      });
    }

    const matchedCount = await imageProvider.updateImageName(id, newName);

    // 4. Image doesn't exist in DB
    if (matchedCount === 0) {
      return res.status(404).send({
        error: "Not Found",
        message: "Image does not exist",
      });
    }

    res.status(204).send();
  });
}
