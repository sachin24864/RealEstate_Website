import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the upload directories exist
const blogUploadDir = "public/uploads/blogs";
const propertyUploadDir = "public/uploads/properties";
fs.mkdirSync(blogUploadDir, { recursive: true });
fs.mkdirSync(propertyUploadDir, { recursive: true });

const propertyImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, propertyUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const blogImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const propertyUpload = multer({
  storage: propertyImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
    }
  },
});

export const blogUpload = multer({
  storage: blogImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
    }
  },
});
