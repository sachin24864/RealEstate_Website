import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { message } from 'antd';
import { galleryClient } from '@/store';
import { AxiosError } from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface GalleryImage {
    _id: string;
    title: string;
    description: string;
    image: string;
    category: 'Office Environment' | 'Client Dealing';
    createdAt: string;
}

const AdminGallery: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<'Office Environment' | 'Client Dealing'>('Office Environment');


    // New: title & description fields for upload
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadDescription, setUploadDescription] = useState('');

    const categories: Array<'Office Environment' | 'Client Dealing'> = ['Office Environment', 'Client Dealing'];


    // Fetch images on component mount and when category changes
    useEffect(() => {
        fetchImages();
    }, [selectedCategory]);

    const fetchImages = async () => {
        try {
            setFetching(true);
            const response = await galleryClient.getImages(selectedCategory);
            setImages(response.images || []);
        } catch (err) {
            console.error('Error fetching images:', err);
            message.error('Failed to fetch gallery images');
        } finally {
            setFetching(false);
        }
    };

    const handleUpload = async (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            message.error('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            message.error('File size must be less than 5MB');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('title', uploadTitle || file.name.replace(/\.[^/.]+$/, ""));
            formData.append('description', uploadDescription || '');
            formData.append('category', selectedCategory);

            const response = await galleryClient.uploadImage(formData);

            // Response expected to include 'image' object with _id, image (path), title, etc.
            const newImage: GalleryImage = response.image;

            // Add new image to the list
            // setImages([response.image, ...images]);
            // message.success('Image uploaded successfully');
            setImages([newImage, ...images]);
            message.success('Image uploaded successfully');

            // Clear upload fields
            setUploadTitle('');
            setUploadDescription('')

        } catch (err) {
            console.error('Error uploading image:', err);
            if (err instanceof AxiosError) {
                message.error(err.response?.data?.message || 'Failed to upload image');
            } else {
                message.error('Failed to upload image');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await galleryClient.deleteImage(id);
            setImages(images.filter(img => img._id !== id));
            message.success('Image deleted successfully');
        } catch (err) {
            console.error('Error deleting image:', err);
            if (err instanceof AxiosError) {
                message.error(err.response?.data?.message || 'Failed to delete image');
            } else {
                message.error('Failed to delete image');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Gallery Management</h2>
                <p className="text-muted-foreground">Upload and manage gallery images with categories</p>
            </div>

            {/* Category Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                onClick={() => setSelectedCategory(cat)}
                                className="capitalize"
                                size="lg"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Upload Section */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload Image to "{selectedCategory}"
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Click to upload or drag and drop</span>
                                <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                                disabled={loading}
                                className="hidden"
                            />
                        </label>
                        {loading && <p className="text-sm text-blue-600">Uploading to {selectedCategory}...</p>}
                    </div>
                </CardContent>
            </Card> */}
            <Card>
                <CardHeader>
                    <CardTitle>Upload Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <input
                            placeholder="Image title (optional)"
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-white text-black"
                        />
                        <input
                            placeholder="Description (optional)"
                            value={uploadDescription}
                            onChange={(e) => setUploadDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-white text-black"
                        />
                        <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Click to upload or drag and drop</span>
                                <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                                disabled={loading}
                                className="hidden"
                            />
                        </label>
                        {loading && <p className="text-sm text-blue-600">Uploading to {selectedCategory}...</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Gallery Images */}
            {fetching ? (
                <Card className="text-center py-12">
                    <p className="text-gray-600">Loading images...</p>
                </Card>
            ) : images.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Images in "{selectedCategory}"
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                ({images.length} image{images.length !== 1 ? 's' : ''})
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {images.map((image) => (
                                <div
                                    key={image._id}
                                    className="group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition"
                                >
                                    <img
                                        src={image.image && (image.image.startsWith('http') ? image.image : `${BACKEND_URL}${image.image}`)}
                                        alt={image.title}
                                        className="w-full h-48 object-cover bg-gray-100"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                    {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex flex-col items-end justify-between p-3">
                                        <div className="opacity-0 group-hover:opacity-100 transition text-white flex-1 w-full">
                                            <h3 className="text-sm font-medium truncate">{image.title}</h3>
                                            <p className="text-xs text-gray-300 truncate">{image.description || 'No description'}</p>
                                        </div> */}
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium truncate">{image.title || 'Untitled'}</h3>
                                        <p className="text-xs text-gray-500 truncate">{image.description || ''}</p>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                                        {/* <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(image._id)}
                                            className="opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button> */}
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(image._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="text-center py-12">
                    <div className="text-gray-400">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-600">No images in "{selectedCategory}"</p>
                        <p className="text-sm text-gray-500">Upload your first image to get started</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AdminGallery;