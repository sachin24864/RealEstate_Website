import fs from "fs";
import path from "path";
import Gallery from "../models/gallery.js";

/* ================= CONSTANTS ================= */

const ALLOWED_CATEGORIES = [
  "Office Environment",
  "Client Dealing",
  "Home Banner",
];

/* ================= UPLOAD ================= */

export const uploadGalleryImage = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Valid category is required (${ALLOWED_CATEGORIES.join(", ")})`,
      });
    }

    const imageUrl = `/${req.file.path
      .replace(/\\/g, "/")
      .replace("public/", "")}`;

    /* ================= HOME BANNER RULE ================= */

    if (category === "Home Banner") {
      // Find existing home banner
      const existingBanner = await Gallery.findOne({ category: "Home Banner" });

      if (existingBanner) {
        // Delete existing image file
        if (existingBanner.image) {
          const oldImagePath = path.join(
            process.cwd(),
            "public",
            existingBanner.image.replace(/^\//, "")
          );

          try {
            await fs.promises.unlink(oldImagePath);
          } catch (err) {
            console.error("Error deleting old banner file:", err);
          }
        }

        // Delete existing banner from DB
        await Gallery.findByIdAndDelete(existingBanner._id);
      }
    }

    /* ================= SAVE NEW IMAGE ================= */

    const newImage = new Gallery({
      title: title || req.file.originalname,
      description: description || "",
      image: imageUrl,
      category,
    });

    await newImage.save();

    res.status(201).json({
      message:
        category === "Home Banner"
          ? "Home banner replaced successfully"
          : "Image uploaded successfully",
      image: newImage,
    });
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    res.status(500).json({
      message: "Server error while uploading image.",
    });
  }
};

/* ================= FETCH ================= */

export const getAllGalleryImages = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};

    if (category && ALLOWED_CATEGORIES.includes(category)) {
      query.category = category;
    }

    const images = await Gallery.find(query).sort({ createdAt: -1 });

    res.status(200).json({ images });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).json({
      message: "Server error while fetching images.",
    });
  }
};

/* ================= DELETE ================= */

export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    // Delete image file
    if (image.image) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        image.image.replace(/^\//, "")
      );

      try {
        await fs.promises.unlink(imagePath);
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    }

    await Gallery.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    res.status(500).json({
      message: "Server error while deleting image.",
    });
  }
};

/* ================= UPDATE ================= */

export const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Valid category is required (${ALLOWED_CATEGORIES.join(", ")})`,
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    const image = await Gallery.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    res.status(200).json({
      message: "Image updated successfully",
      image,
    });
  } catch (error) {
    console.error("Error updating gallery image:", error);
    res.status(500).json({
      message: "Server error while updating image.",
    });
  }
};
