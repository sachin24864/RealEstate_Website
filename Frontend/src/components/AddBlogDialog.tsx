import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography } from 'antd';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
const { Title, Paragraph } = Typography;
import { blogClint } from "../store/index";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { message } from "antd";

interface AddBlogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (blog: any) => void;
}

export function AddBlogDialog({ open, onOpenChange, onAdd }: AddBlogDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        image: null as File | null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.image) {
            message.error("Title, description, and image are required.");
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("description", formData.description);
            fd.append("slug", formData.slug || "");
            fd.append("metaTitle", formData.metaTitle || formData.title);
            fd.append("metaDescription", formData.metaDescription || formData.description.substring(0, 160));
            fd.append("metaKeywords", formData.metaKeywords || "");
            fd.append("image", formData.image);

            const res = await blogClint.createBlog(fd);
            onAdd(res.blog);
            message.success("Blog created successfully!");

            setFormData({
                title: "",
                description: "",
                slug: "",
                metaTitle: "",
                metaDescription: "",
                metaKeywords: "",
                image: null,
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating blog:", error);
            message.error("Failed to create blog.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Blog Post</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Blog Content */}
                    <div>
                        <Label htmlFor="title">Blog Title *</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter blog title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Blog Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Enter blog description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label htmlFor="image">Blog Image *</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {/* SEO Fields */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">SEO Settings</h3>

                        <div>
                            <Label htmlFor="slug">URL Slug (auto-generated if empty)</Label>
                            <Input
                                id="slug"
                                name="slug"
                                placeholder="blog-url-slug"
                                value={formData.slug}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">e.g., my-blog-post-title</p>
                        </div>

                        <div>
                            <Label htmlFor="metaTitle">Meta Title (for search engines)</Label>
                            <Input
                                id="metaTitle"
                                name="metaTitle"
                                placeholder={formData.title || "Enter meta title"}
                                value={formData.metaTitle}
                                onChange={handleChange}
                                maxLength={60}
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
                        </div>

                        <div>
                            <Label htmlFor="metaDescription">Meta Description (for search engines)</Label>
                            <Textarea
                                id="metaDescription"
                                name="metaDescription"
                                placeholder={formData.description.substring(0, 160) || "Enter meta description"}
                                value={formData.metaDescription}
                                onChange={handleChange}
                                maxLength={160}
                                rows={3}
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
                        </div>

                        <div>
                            <Label htmlFor="metaKeywords">Meta Keywords (comma-separated)</Label>
                            <Input
                                id="metaKeywords"
                                name="metaKeywords"
                                placeholder="keyword1, keyword2, keyword3"
                                value={formData.metaKeywords}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate keywords with commas for SEO</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Blog"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
