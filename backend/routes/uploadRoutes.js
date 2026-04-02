import express from "express";
import multer from "multer";
import path from "path";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route
router.post("/", upload.single("image"), uploadImage);

export default router;
