import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Edit2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { blogClint } from "@/store";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Blog {
    _id: string;
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    createdAt: string;
}

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 160;

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddEditOpen, setIsAddEditOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [metaKeywords, setMetaKeywords] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageAlt, setImageAlt] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const data = await blogClint.getBlog();
                setBlogs(data.blogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                toast.error("Failed to load blogs.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const resetForm = () => {
        setTitle("");
        setSlug("");
        setDescription("");
        setMetaTitle("");
        setMetaDescription("");
        setMetaKeywords("");
        setImageFile(null);
        setImagePreview(null);
        setImageAlt("");
        setEditingBlog(null);
    };

    const openAdd = () => {
        resetForm();
        setIsAddEditOpen(true);
    };

    const openEdit = (b: Blog) => {
        setEditingBlog(b);
        setTitle(b.title || "");
        setSlug(b.slug || "");
        setDescription(b.description || "");
        setMetaTitle(b.metaTitle || "");
        setMetaDescription(b.metaDescription || "");
        setMetaKeywords(b.metaKeywords || "");
        setImagePreview(b.image ? `${BACKEND_URL}${b.image}` : null);
        setImageAlt(b.imageAlt || "");
        setIsAddEditOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        setImageFile(f);
        if (f) {
            const url = URL.createObjectURL(f);
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    const validateSlugFormat = (s: string) => {
        if (!s) return true; // allow blank -> server may generate
        return /^[a-z0-9-]+$/.test(s);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!title.trim()) {
            toast.error("Title is required.");
            return;
        }
        if (metaTitle.length > MAX_TITLE) {
            toast.error(`Meta title should be <= ${MAX_TITLE} characters.`);
            return;
        }
        if (metaDescription.length > MAX_DESCRIPTION) {
            toast.error(`Meta description should be <= ${MAX_DESCRIPTION} characters.`);
            return;
        }
        if (!validateSlugFormat(slug)) {
            toast.error("Slug can only contain lowercase letters, numbers and hyphens.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (slug) formData.append("slug", slug);
        if (metaTitle) formData.append("metaTitle", metaTitle);
        if (metaDescription) formData.append("metaDescription", metaDescription);
        if (metaKeywords) formData.append("metaKeywords", metaKeywords);
        if (imageFile) formData.append("image", imageFile);
        if (imageAlt) formData.append("imageAlt", imageAlt);

        try {
            if (editingBlog) {
                // Update flow - assumes blogClint.updateBlog(id, formData) exists
                const res = await blogClint.updateBlog(editingBlog._id, formData);
                // replace blog in list
                setBlogs((prev) => prev.map((b) => (b._id === editingBlog._id ? res.blog : b)));
                toast.success("Blog updated successfully.");
            } else {
                // Create flow - assumes blogClint.createBlog(formData) exists and returns created blog
                const res = await blogClint.createBlog(formData);
                setBlogs((prev) => [res.blog, ...prev]);
                toast.success("Blog created successfully.");
            }
            setIsAddEditOpen(false);
            resetForm();
        } catch (err) {
            console.error("Error saving blog:", err);
            toast.error("Failed to save blog.");
        }
    };

    const handleDeleteBlog = async () => {
        if (!blogToDelete) return;

        try {
            await blogClint.deleteBlog(blogToDelete);
            setBlogs((prev) => prev.filter((blog) => blog._id !== blogToDelete));
            toast.success("Blog post deleted successfully.");
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog post.");
        } finally {
            setBlogToDelete(null);
        }
    };

    // Small SERP/social preview component (rendered inline)
    const SeoPreview: React.FC = () => {
        const previewTitle = metaTitle || title || "Title preview";
        const previewDesc = metaDescription || description.slice(0, 160) || "Description preview";
        const previewUrl = `${location.origin}/blog/${slug || (editingBlog?._id ?? "id")}`;

        return (
            <div className="mt-3 p-3 border rounded bg-white">
                <div className="text-sky-600 font-medium">{previewTitle}</div>
                <div className="text-sm text-slate-500">{previewUrl}</div>
                <div className="mt-1 text-sm text-slate-600">{previewDesc}</div>
            </div>
        );
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Blogs</h1>
                <Button onClick={openAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Blog
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                            ) : blogs.length > 0 ? (
                                blogs.map((blog) => (
                                    <TableRow key={blog._id}>
                                        <TableCell>
                                            <img src={`${BACKEND_URL}${blog.image}`} alt={blog.imageAlt || blog.title} className="h-12 w-16 object-contain bg-gray-200 rounded-md" />
                                        </TableCell>
                                        <TableCell className="font-medium">{blog.title}</TableCell>
                                        <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right flex gap-2 justify-end">
                                            <Button variant="ghost" size="sm" onClick={() => openEdit(blog)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => setBlogToDelete(blog._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4} className="text-center">No blog posts found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Inline Add/Edit Modal (improved: responsive, centered, scrollable) */}
            {isAddEditOpen && (
                <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center py-6 px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => { setIsAddEditOpen(false); resetForm(); }} />

                    <form
                        className="relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-lg p-6
                                   max-h-[80vh] overflow-y-auto"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{editingBlog ? "Edit Blog" : "Add Blog"}</h2>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => { setIsAddEditOpen(false); resetForm(); }}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Slug (optional)</label>
                                <input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="my-blog-slug"
                                />
                                {!validateSlugFormat(slug) && (
                                    <div className="text-xs text-red-600 mt-1">
                                        Use only lowercase letters, numbers and hyphens.
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Image Alt (optional)</label>
                                <input
                                    value={imageAlt}
                                    onChange={(e) => setImageAlt(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="describe the image"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Description (content)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={6}
                                    className="w-full border rounded px-2 py-1 resize-vertical min-h-[6rem]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Meta Title</label>
                                <input
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                                <div className="text-xs text-slate-500 mt-1">{metaTitle.length}/{MAX_TITLE} chars</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Meta Description</label>
                                <textarea
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    rows={3}
                                    className="w-full border rounded px-2 py-1 resize-vertical min-h-[4rem]"
                                />
                                <div className="text-xs text-slate-500 mt-1">{metaDescription.length}/{MAX_DESCRIPTION} chars</div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Meta Keywords (comma separated)</label>
                                <input
                                    value={metaKeywords}
                                    onChange={(e) => setMetaKeywords(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Image (optional)</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                                {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 max-h-48 rounded object-contain" />}
                            </div>
                        </div>

                        <SeoPreview />

                        <div className="mt-4 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => { setIsAddEditOpen(false); resetForm(); }}>Cancel</Button>
                            <Button type="submit">{editingBlog ? "Update Blog" : "Create Blog"}</Button>
                        </div>
                    </form>
                </div>
            )}

            <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this blog post.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteBlog} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default Blogs;