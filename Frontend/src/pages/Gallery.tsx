import { useEffect, useState } from "react";
import { galleryClient } from "@/store/index";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { message } from "antd";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface GalleryImage {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: 'Office Environment' | 'Client Dealing';
  createdAt: string;
}

export default function PropertyGallery() {
  const [officeImages, setOfficeImages] = useState<GalleryImage[]>([]);
  const [clientImages, setClientImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true);

        // Fetch Office Environment images
        const officeData = await galleryClient.getImages('Office Environment');
        setOfficeImages(officeData.images || []);

        // Fetch Client Dealing images
        const clientData = await galleryClient.getImages('Client Dealing');
        setClientImages(clientData.images || []);

      } catch (error) {
        console.error("Error fetching gallery images:", error);
        message.error("Failed to load gallery images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const GallerySection = ({
    title,
    images
  }: {
    title: string;
    images: GalleryImage[]
  }) => (
    <div className="mb-20">
      <h2 className="text-3xl font-semibold mb-8 border-b-2 border-gray-600 pb-2">
        {title}
      </h2>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image._id}>
              <Card
                // key={image._id}
                className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative overflow-hidden bg-gray-900">
                  <img
                    src={image.image && (image.image.startsWith('http') ? image.image : `${BACKEND_URL}${image.image}`)}
                    alt={image.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { /* same fallback */ }}
                  />
                </div>
                
                {/* {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-sm truncate">{image.title}</h3>
                    {image.description && (
                      <p className="text-xs text-gray-300 truncate">{image.description}</p>
                    )}
                  </div>
                )}
            </div> */}


                {/* Title displayed below the image */}
                <div className="p-3 bg-white text-black">
                  <h3 className="font-semibold text-sm truncate">{image.title || 'Untitled'}</h3>
                  {image.description && <p className="text-xs text-gray-600 truncate">{image.description}</p>}
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-10">
          No {title.toLowerCase()} images available.
        </p>
      )
      }
    </div >
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-800 py-20 px-6 sm:px-10 lg:px-20 text-white">
        <h1 className="text-4xl font-bold text-center mb-14">
          Our Gallery
        </h1>

        {isLoading ? (
          <div className="text-center text-gray-300 text-lg py-20">
            Loading images...
          </div>
        ) : (
          <>
            <GallerySection title="Office Environment" images={officeImages} />
            <GallerySection title="Client Dealing" images={clientImages} />
          </>
        )}
      </div>
      <Footer />
    </>
  );
} 
