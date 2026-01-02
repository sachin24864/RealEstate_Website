import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { message } from 'antd';
import { galleryClient } from '@/store';
import { AxiosError } from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* ================= TYPES ================= */

type ImageCategory =
  | 'Office Environment'
  | 'Client Dealing'
  | 'Home Banner';

interface GalleryImage {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: ImageCategory;
  createdAt: string;
}

/* ================= COMPONENT ================= */

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState<ImageCategory>('Home Banner');

  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');

  const categories: ImageCategory[] = [
    'Office Environment',
    'Client Dealing',
    'Home Banner',
  ];

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    try {
      setFetching(true);
      const response = await galleryClient.getImages(selectedCategory);
      setImages(response.images || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch images');
    } finally {
      setFetching(false);
    }
  };

  /* ================= UPLOAD ================= */

  const handleUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      message.error('Only image files allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error('Max file size is 5MB');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append(
        'title',
        uploadTitle || file.name.replace(/\.[^/.]+$/, '')
      );
      formData.append('description', uploadDescription || '');
      formData.append('category', selectedCategory);

      const response = await galleryClient.uploadImage(formData);
      setImages([response.image, ...images]);

      message.success('Image uploaded successfully');

      setUploadTitle('');
      setUploadDescription('');
    } catch (err) {
      if (err instanceof AxiosError) {
        message.error(err.response?.data?.message || 'Upload failed');
      } else {
        message.error('Upload failed');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    try {
      await galleryClient.deleteImage(id);
      setImages(images.filter((img) => img._id !== id));
      message.success('Image deleted');
    } catch (err) {
      if (err instanceof AxiosError) {
        message.error(err.response?.data?.message || 'Delete failed');
      } else {
        message.error('Delete failed');
      }
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Gallery Management</h2>
        <p className="text-muted-foreground">
          Upload and manage gallery & homepage banners
        </p>
      </div>

      {/* CATEGORY SELECT */}
      <Card>
        <CardHeader>
          <CardTitle>Select Category</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              size="lg"
            >
              {cat}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* HOME BANNER WARNING */}
      {selectedCategory === 'Home Banner' && (
        <Card className="border-yellow-400 bg-yellow-50">
          <CardContent className="text-sm text-yellow-800 py-4">
            ⚠️ <strong>Home Banner:</strong>  
            This image appears on the homepage banner.  
            <br />
            Recommended size: <strong>1920 × 700</strong>
          </CardContent>
        </Card>
      )}

      {/* UPLOAD */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Title (optional)"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Description (optional)"
            value={uploadDescription}
            onChange={(e) => setUploadDescription(e.target.value)}
          />

          <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <span className="text-sm">Click or drag image here</span>
            <span className="text-xs text-gray-500">PNG / JPG up to 5MB</span>
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={loading}
              onChange={(e) =>
                e.target.files && handleUpload(e.target.files[0])
              }
            />
          </label>

          {loading && (
            <p className="text-sm text-blue-600">Uploading...</p>
          )}
        </CardContent>
      </Card>

      {/* IMAGES */}
      {fetching ? (
        <Card className="text-center py-12">Loading images...</Card>
      ) : images.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory} ({images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((img) => (
                <div
                  key={img._id}
                  className="relative rounded-lg overflow-hidden border group"
                >
                  <img
                    src={
                      img.image.startsWith('http')
                        ? img.image
                        : `${BACKEND_URL}${img.image}`
                    }
                    className="w-full h-48 object-cover"
                    alt={img.title}
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-medium truncate">
                      {img.title || 'Untitled'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {img.description || ''}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(img._id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <p>No images found</p>
        </Card>
      )}
    </div>
  );
};

export default AdminGallery;
