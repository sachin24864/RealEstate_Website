import fs from "fs";
import path from "path";
import Blog from "../Models/blog.js";

export const createBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Image is required." });
        }

        // Stored in DB as: /uploads/whatever.jpg
        const imageUrl = `/${req.file.path.replace(/\\/g, "/").replace("public/", "")}`;

        const newBlog = new Blog({
            title,
            description,
            image: imageUrl,
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
