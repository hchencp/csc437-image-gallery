import multer from "multer";
import { getEnvVar } from "../getEnvVar.js";

class ImageFormatError extends Error {}

const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    // Make sure you create a folder named 'uploads' in your backend root!
    cb(null, getEnvVar("IMAGE_UPLOAD_DIR") || "uploads");
  },
  filename: function (req, file, cb) {
    // 1. Determine Extension
    let fileExtension = "";
    if (file.mimetype === "image/png") fileExtension = "png";
    else if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg")
      fileExtension = "jpg";

    if (!fileExtension) {
      return cb(new ImageFormatError("Unsupported image type"), "");
    }

    // 2. Generate Random Name
    const fileName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + fileExtension;
    cb(null, fileName);
  },
});

export const imageMiddlewareFactory = multer({
  storage: storageEngine,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export function handleImageFileErrors(err, req, res, next) {
  if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
    return res.status(400).send({
      error: "Bad Request",
      message: err.message,
    });
  }
  next(err);
}
