import fs from "fs";
import path from "path";
import Blog from "../models/blog.js";

// Helper to create slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

export const createBlog = async (req, res) => {
    try {
        const {
            title,
            description,
            slug: reqSlug,
            metaTitle,
            metaDescription,
            metaKeywords,
            imageAlt,
        } = req.body || {};

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        // If a file was uploaded, build the stored URL. Otherwise leave image empty.
        let imageUrl = "";
        if (req.file) {
            imageUrl = `/${req.file.path.replace(/\\/g, "/").replace("public/", "")}`;
        }

        // Generate slug if not provided
        const blogSlug = reqSlug && typeof reqSlug === "string" && reqSlug.trim() !== "" ? reqSlug : generateSlug(title);

        const newBlog = new Blog({
            title,
            description,
            image: imageUrl,
            slug: blogSlug,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || (description ? description.substring(0, 160) : ""),
            metaKeywords: metaKeywords || "",
            imageAlt: imageAlt || "",
        });

        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ message: "Server error while creating blog." });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ blogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Server error while fetching blogs." });
    }
};

export const getBlogById = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne(slug);
    if (!blog) return res.status(404).json({ message: "Blog not found." });
    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error fetching blog by id:", error);
    res.status(500).json({ message: "Server error while fetching blog." });
  }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find blog first (so we still have access to image path)
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found." });
        }

        // 2. Build absolute path of the image on disk
        if (blog.image) {
            // blog.image example: "/uploads/blogs/abc123.jpg"
            const imagePath = path.join(
                process.cwd(),
                "public",
                blog.image.replace(/^\//, "") // remove starting / so path.join works correctly
            );

            // 3. Try deleting the image file
            try {
                await fs.promises.unlink(imagePath);
                console.log("Image deleted:", imagePath);
            } catch (err) {
                // Don't block blog deletion if image is missing or error occurs; just log it
                console.error("Error deleting image file:", err);
            }
        }

        // 4. Delete blog from DB
        await Blog.findByIdAndDelete(id);

        res.status(200).json({ message: "Blog deleted successfully." });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "Server error while deleting blog." });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, slug, metaTitle, metaDescription, metaKeywords, imageAlt } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (slug) updateData.slug = slug;
        if (metaTitle) updateData.metaTitle = metaTitle;
        if (metaDescription) updateData.metaDescription = metaDescription;
        if (metaKeywords) updateData.metaKeywords = metaKeywords;
        if (imageAlt) updateData.imageAlt = imageAlt;
        // If a new file uploaded, update image path and try to remove previous file
        if (req.file) {
            const imageUrl = `/${req.file.path.replace(/\\/g, "/").replace("public/", "")}`;
            updateData.image = imageUrl;

            // Remove previous image file if present
            try {
                const existing = await Blog.findById(id);
                if (existing && existing.image) {
                    const existingPath = path.join(process.cwd(), "public", existing.image.replace(/^\//, ""));
                    await fs.promises.unlink(existingPath).catch((e) => {
                        // Log but don't fail the update if old file can't be removed
                        console.error("Error removing old image:", e);
                    });
                }
            } catch (e) {
                console.error("Error while handling previous image removal:", e);
            }
        }

        const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
        if (!blog) return res.status(404).json({ message: "Blog not found." });

        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Server error while updating blog." });
    }
};